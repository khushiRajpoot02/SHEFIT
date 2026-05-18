import { createSlice } from "@reduxjs/toolkit";
import { WorkoutPlan } from "../../types";

type workoutSLiceState = {
    plans : WorkoutPlan[],
    selectedPlan : WorkoutPlan | null,
    loading : boolean,
    error :string,

}

const workoutsSlice = createSlice({
    name : 'workout',
    initialState : {
        WorkoutPlan: [], 
        selectedPlan : WorkoutPlan | null,
        loading : false
        
    },
    reducers : {
        // fetch workout plans 

    }
})

