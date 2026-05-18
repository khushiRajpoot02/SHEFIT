# Redux Setup Guide — GymGirl

## Folder Structure

```
src/store/
  index.ts                    ← configureStore + export RootState, AppDispatch
  slices/
    workoutsSlice.ts          ← catalogue: fetch plans, select a plan
    activeWorkoutSlice.ts     ← live session: set/rest/exercise progression
```

---

## Types Reference (`src/types/index.ts`)

Your key types already defined:

| Type | Used in |
|---|---|
| `WorkoutPlan` | workoutsSlice, WorkoutListScreen, WorkoutDetailScreen |
| `WorkoutExcercise` | activeWorkoutSlice, ActiveWorkoutScreen |
| `ActiveWorkoutSession` | activeWorkoutSlice state shape |
| `Wrokoutlogs` | Profile screen — workout history |

---

## Step 1 — `workoutsSlice.ts`

### State shape
```ts
type WorkoutsState = {
  plans: WorkoutPlan[]
  selectedPlan: WorkoutPlan | null
  loading: boolean
  error: string | null
}
```

### initialState — correct syntax
```ts
// WRONG (what you have now)
initialState: {
  WorkoutPlan: [],
  selectedPlan: WorkoutPlan | null,  // ← this is TypeScript syntax, not a value
}

// CORRECT
const initialState: WorkoutsState = {
  plans: [],
  selectedPlan: null,
  loading: false,
  error: null,
}
```

### Async thunk — fetchWorkoutPlans
```ts
export const fetchWorkoutPlans = createAsyncThunk(
  'workouts/fetchAll',
  async () => {
    const snapshot = await firestore().collection('workoutPlans').get()
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as WorkoutPlan[]
  }
)
```

### Slice
```ts
const workoutsSlice = createSlice({
  name: 'workouts',
  initialState,
  reducers: {
    selectPlan: (state, action: PayloadAction<WorkoutPlan>) => {
      state.selectedPlan = action.payload
    },
    clearSelectedPlan: (state) => {
      state.selectedPlan = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkoutPlans.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWorkoutPlans.fulfilled, (state, action) => {
        state.loading = false
        state.plans = action.payload
      })
      .addCase(fetchWorkoutPlans.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to fetch plans'
      })
  },
})
```

### Exports
```ts
export const { selectPlan, clearSelectedPlan } = workoutsSlice.actions
export default workoutsSlice.reducer
```

---

## Step 2 — `activeWorkoutSlice.ts`

### State shape
```ts
// Use your existing ActiveWorkoutSession type or inline it
type ActiveWorkoutState = {
  plan: WorkoutPlan | null
  currentExcerciseIndex: number
  currentSet: number
  phase: 'excercise' | 'rest' | 'completed'
  timerSeconds: number
  startedAt: number | null
}
```

### initialState
```ts
const initialState: ActiveWorkoutState = {
  plan: null,
  currentExcerciseIndex: 0,
  currentSet: 1,
  phase: 'excercise',
  timerSeconds: 0,
  startedAt: null,
}
```

### Reducers needed

| Action | What it does |
|---|---|
| `startWorkout(plan)` | sets plan, resets index/set to 0/1, phase = excercise, startedAt = Date.now() |
| `nextSet()` | if currentSet < total sets → increment set. Else → phase = rest, timerSeconds = restTime |
| `tickRest()` | decrement timerSeconds by 1. When 0 → next exercise or phase = completed |
| `skipRest()` | immediately move to next exercise |
| `endWorkout()` | reset everything back to initialState |

### Exports
```ts
export const { startWorkout, nextSet, tickRest, skipRest, endWorkout } = activeWorkoutSlice.actions
export default activeWorkoutSlice.reducer
```

---

## Step 3 — `store/index.ts`

```ts
import { configureStore } from '@reduxjs/toolkit'
import workoutsReducer from './slices/workoutsSlice'
import activeWorkoutReducer from './slices/activeWorkoutSlice'

export const store = configureStore({
  reducer: {
    workouts: workoutsReducer,
    activeWorkout: activeWorkoutReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

---

## Step 4 — Typed hooks (optional but recommended)

Create `src/store/hooks.ts`:
```ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './index'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

Use these instead of plain `useDispatch` / `useSelector` everywhere — you get full TypeScript autocomplete.

---

## Step 5 — Wire Redux in App.tsx

Already done — you have `<Provider store={store}>` wrapping the app. Just make sure it points to `src/store/index.ts` not `src/practice/store`.

---

## How Each Screen Connects

### WorkoutListScreen
```ts
const dispatch = useAppDispatch()
const { plans, loading } = useAppSelector(state => state.workouts)

useEffect(() => { dispatch(fetchWorkoutPlans()) }, [])

// on card press:
dispatch(selectPlan(item))
navigation.navigate('Workout DetailScreen')
```

### WorkoutDetailScreen
```ts
const plan = useAppSelector(state => state.workouts.selectedPlan)

// back button:
navigation.goBack()

// start workout button:
dispatch(startWorkout(plan))
navigation.navigate('Active Workout')
```

### ActiveWorkoutScreen
```ts
const { plan, currentExcerciseIndex, currentSet, phase, timerSeconds } = useAppSelector(state => state.activeWorkout)
const dispatch = useAppDispatch()

// rest timer — tick every second:
useEffect(() => {
  if (phase !== 'rest') return
  const interval = setInterval(() => dispatch(tickRest()), 1000)
  return () => clearInterval(interval)
}, [phase])

// done button:
dispatch(nextSet())

// quit:
dispatch(endWorkout())
navigation.goBack()
```

---

## Common Mistakes to Avoid

| Mistake | Fix |
|---|---|
| `selectedPlan: WorkoutPlan \| null` inside initialState | That's a type annotation, not a value. Use `null` as the value |
| `WorkoutPlan: []` as the key name | Key should be `plans: []` |
| Using plain `useSelector` without types | Use `useAppSelector` from typed hooks |
| Importing from `src/practice/store` | Use `src/store/index.ts` — practice store is separate |
| Forgetting to wrap `tickRest` in `useEffect` cleanup | Always return `clearInterval` to avoid memory leaks |
