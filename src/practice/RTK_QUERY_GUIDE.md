# RTK Query — Complete Learning Guide

---

## 1. What is RTK Query & Why Use It

RTK Query eliminates boilerplate you normally write with createAsyncThunk.

```
createAsyncThunk way:          RTK Query way:
─────────────────────          ──────────────
Write thunk manually     →     Auto generated
Write extraReducers      →     Auto generated
Write loading state      →     Auto generated
Write error state        →     Auto generated
Write cache logic        →     Auto generated
Write refetch logic      →     Auto generated
```

---

## 2. Folder Structure

```
src/
├── store/
│   ├── index.ts                    ← redux store
│   └── services/
│       ├── baseQuery.ts            ← fetchBaseQuery + token + reauth
│       ├── postsApi.ts             ← posts module
│       └── stationApi.ts           ← another module (same pattern)
│
└── screens/
    └── PostScreen.tsx              ← usage
```

---

## 3. baseQuery.ts — Foundation of All API Calls

```typescript
import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

// STEP 1 — raw base query (like axios.create)
const rawBaseQuery = fetchBaseQuery({

  baseUrl: 'https://api.example.com/v1',
  // baseUrl is prepended to every endpoint path
  // '/posts' becomes 'https://api.example.com/v1/posts'

  prepareHeaders: async (headers) => {
    // runs before EVERY request — like axios request interceptor
    const token = 'your-token-here'; // in real app: from Keychain
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// STEP 2 — wrap with reauth logic (handles 401 token refresh)
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {

  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    // token expired — try refresh
    const refreshResult = await rawBaseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
        body: { refreshToken: 'get-from-keychain' },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // save new tokens to Keychain here
      // retry original request
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      // refresh failed → logout user
      // api.dispatch(logoutUser());
    }
  }

  return result;
};
```

### Key Points
- `fetchBaseQuery` = RTK Query's built-in fetch wrapper (no axios needed)
- `prepareHeaders` = runs before every request (attach token here)
- `baseQueryWithReauth` = wrapper that handles 401 + token refresh
- `rawBaseQuery` is called inside `baseQueryWithReauth` — separation of concerns

---

## 4. createApi — Every Option Explained

```typescript
import { createApi } from '@reduxjs/toolkit/query/react'; // /react is REQUIRED for hooks
import { baseQueryWithReauth } from './baseQuery';

export const postApi = createApi({

  // 1. reducerPath — unique key for this API in Redux store
  //    each createApi MUST have a different reducerPath
  reducerPath: 'postApi',

  // 2. baseQuery — which base query function to use
  baseQuery: baseQueryWithReauth,

  // 3. tagTypes — declare all cache tag names upfront
  //    tags are labels used for cache invalidation
  tagTypes: ['Post'],

  // 4. endpoints — define all your API calls here
  endpoints: (builder) => ({

    // QUERY (GET) — for reading data
    getPosts: builder.query<Post[], void>({
    //                      ↑      ↑
    //                 ReturnType  ArgType (void = no argument)

      query: () => '/posts',
      // GET requests: just return the path string

      providesTags: ['Post'],
      // "label this cached data as Post"
      // when 'Post' is invalidated → this refetches automatically
    }),

    // QUERY with argument
    getPostById: builder.query<Post, number>({
      query: (id) => `/posts/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Post', id }],
      // tags each individual post with its id
    }),

    // MUTATION (POST) — for creating data
    createPost: builder.mutation<Post, { title: string; body: string; userId: number }>({
      query: (newPost) => ({
        url: '/posts',
        method: 'POST',
        body: newPost,      // POST needs body
      }),
      invalidatesTags: ['Post'],
      // "after this runs, clear Post cache → getPosts will refetch"
    }),

    // MUTATION (PUT) — for updating data
    updatePost: builder.mutation<Post, { id: number; title: string; body: string }>({
      query: ({ id, title, body }) => ({
        url: `/posts/${id}`,   // id from arg used in URL
        method: 'PUT',         // PUT not 'UPDATE'
        body: { title, body }, // only send updatable fields
      }),
      invalidatesTags: ['Post'],
    }),

    // MUTATION (DELETE) — for deleting data
    deletePost: builder.mutation<void, number>({
    //                           ↑     ↑
    //                      void return  just an id (number)
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
        // no body for DELETE
      }),
      invalidatesTags: ['Post'],
    }),

  }),
});

// auto-generated hooks — export for use in components
export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postApi;
```

### Hook Naming Rule
```
use  +  GetPosts  +  Query     =  useGetPostsQuery
use  +  CreatePost + Mutation  =  useCreatePostMutation
 ↑         ↑           ↑
prefix  endpoint    Query or Mutation
        name
        capitalized
```

### GET vs POST/PUT/DELETE query function
```
GET    →  query: () => '/path'                    (string)
POST   →  query: (data) => ({ url, method, body }) (object)
PUT    →  query: ({ id, ...data }) => ({ url: `/path/${id}`, method: 'PUT', body })
DELETE →  query: (id) => ({ url: `/path/${id}`, method: 'DELETE' })
```

### providesTags vs invalidatesTags
```
providesTags    → on queries  → "label this data"
invalidatesTags → on mutations → "clear this label → trigger refetch"

Flow:
getPosts     providesTags: ['Post']      ← data labeled 'Post'
createPost   invalidatesTags: ['Post']   ← clears 'Post' label
Result:      createPost runs → getPosts automatically refetches ✓
```

---

## 5. Store Setup — index.ts

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { postApi } from './services/postsApi';
import { stationApi } from './services/stationApi'; // multiple modules

export const store = configureStore({
  reducer: {
    // normal slices
    auth: authReducer,

    // RTK Query — use reducerPath as key (computed property)
    [postApi.reducerPath]: postApi.reducer,
    // [postApi.reducerPath] evaluates to 'postApi'
    // postApi.reducer manages all cache: data, loading, errors

    [stationApi.reducerPath]: stationApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(postApi.middleware)
      // postApi.middleware enables: caching, invalidation, polling, garbage collection
      .concat(stationApi.middleware),
});

setupListeners(store.dispatch);
// enables refetchOnFocus and refetchOnReconnect per query

export type RootState = ReturnType<typeof store.getState>;
// use in useSelector: (state: RootState) => state.postApi

export type AppDispatch = typeof store.dispatch;
// use in useDispatch: useDispatch<AppDispatch>()
```

### Why each piece
```
[postApi.reducerPath]: postApi.reducer
  ↑ computed key = 'postApi'            ↑ manages cache state

.concat(postApi.middleware)
  ↑ enables caching, invalidation, polling, GC

setupListeners(store.dispatch)
  ↑ enables refetchOnFocus + refetchOnReconnect

RootState   → TypeScript knows shape of entire store
AppDispatch → TypeScript knows dispatch can handle async thunks
```

---

## 6. Provider Setup — App.tsx

```typescript
import { Provider } from 'react-redux';
import { store } from './src/store';

function App() {
  return (
    <Provider store={store}>
      {/* every component inside can now access store */}
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </Provider>
  );
}
```

Without Provider:
```
Error: could not find react-redux context value;
please ensure the component is wrapped in a Provider
```

---

## 7. Usage in Screens

### Query (GET)
```typescript
import { useGetPostsQuery } from '../store/services/postsApi';

const PostScreen = () => {
  const {
    data: posts,    // actual data (Post[])
    isLoading,      // true on first load (no cached data)
    isFetching,     // true on refetch (cached data exists but refreshing)
    isError,        // true if request failed
    error,          // error object
    refetch,        // call this to manually trigger refetch
  } = useGetPostsQuery();
  // useGetPostsQuery(undefined, { skip: !userId }) — conditional call
  // useGetPostsQuery(undefined, { pollingInterval: 30000 }) — poll every 30s
  // useGetPostsQuery(undefined, { refetchOnFocus: true }) — refetch on app focus

  if (isLoading) return <ActivityIndicator />;
  if (isError)   return <Text>Something went wrong</Text>;

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <Text>{item.title}</Text>}
    />
  );
};
```

### Mutation (POST/PUT/DELETE)
```typescript
import {
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} from '../store/services/postsApi';

const PostFormScreen = () => {
  const [createPost, { isLoading, isSuccess, isError }] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const handleCreate = async () => {
    try {
      const result = await createPost({
        title: 'New Post',
        body: 'Content here',
        userId: 1,
      }).unwrap();
      // .unwrap() → throws error if failed, returns data if success
      console.log('Created:', result);
    } catch (error) {
      console.log('Failed:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updatePost({ id: 1, title: 'Updated', body: 'New body' }).unwrap();
    } catch (error) {}
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePost(id).unwrap(); // just pass id
    } catch (error) {}
  };

  return (
    <View>
      <Button
        title={isLoading ? 'Creating...' : 'Create Post'}
        onPress={handleCreate}
        disabled={isLoading}
      />
    </View>
  );
};
```

---

## 8. Adding Multiple Modules (Scaling)

Every new module = new file, same pattern:

```typescript
// stationApi.ts — copy structure, change names
export const stationApi = createApi({
  reducerPath: 'stationApi',   // ← unique, different from postApi
  baseQuery: baseQueryWithReauth, // ← same baseQuery reused
  tagTypes: ['Station'],
  endpoints: (builder) => ({
    getStations: builder.query<Station[], void>({
      query: () => '/stations',
      providesTags: ['Station'],
    }),
  }),
});
```

`axiosInstance` / `baseQuery` never changes — all modules reuse it.

```
baseQuery.ts    ← written once, never touched
    │
    ├── postApi.ts       reducerPath: 'postApi'
    ├── stationApi.ts    reducerPath: 'stationApi'
    ├── fastTagApi.ts    reducerPath: 'fastTagApi'
    └── workoutApi.ts    reducerPath: 'workoutApi'
```

---

## 9. fetchBaseQuery vs Axios — When to Use What

| | fetchBaseQuery | axios |
|---|---|---|
| Extra dependency | No | Yes |
| Built for RTK Query | Yes | No — needs adapter |
| Token refresh | baseQueryWithReauth pattern | interceptors |
| Bundle size | Lighter | Heavier |
| RTK docs recommended | Yes | No |
| Use when | New project | Already using axios in project |

---

## 10. Complete Mental Model

```
Component
  │ calls useGetPostsQuery()
  ▼
RTK Query checks cache
  │ empty → make request
  ▼
baseQueryWithReauth runs
  │ calls rawBaseQuery
  ▼
prepareHeaders
  │ attaches token
  ▼
Request hits backend
  ▼
Response comes back
  ├── 200 → store in Redux under 'postApi' key
  │         tag data with providesTags
  │         component re-renders with data
  │
  ├── 401 → baseQueryWithReauth catches it
  │         refresh token → retry → back to 200 flow
  │
  └── other error → store error in Redux
                    component gets isError: true
```

---

## 11. Quick Reference — Things to Remember

### Import path
```typescript
import { createApi } from '@reduxjs/toolkit/query/react';
//                                                   ↑ /react is REQUIRED
```

### builder.query types
```typescript
builder.query<ReturnType, ArgType>
builder.query<Post[], void>     // no arg
builder.query<Post, number>     // takes id
```

### builder.mutation types
```typescript
builder.mutation<ReturnType, ArgType>
builder.mutation<Post, { title: string }>   // create
builder.mutation<void, number>              // delete (just id)
```

### Hook return values
```
Query   → { data, isLoading, isFetching, isError, error, refetch }
Mutation → [ triggerFn, { isLoading, isSuccess, isError, data } ]
```

### .unwrap()
```typescript
// without unwrap — error doesn't throw, you have to check manually
const result = await createPost(data);

// with unwrap — throws on error, returns data on success
const result = await createPost(data).unwrap();
```
