import { createApi } from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from './baseQuery';

interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
  }

export const postApi = createApi({
    reducerPath : 'postApi',
    baseQuery : baseQueryWithReauth,
    tagTypes : ['Post'],
    endpoints : (builder)=>({
        getPosts: builder.query<Post[], void>({
            query:()=> '/posts',
            
            providesTags:["Post"]
        }),

        // return type , arguments
        createPost: builder.mutation<Post, {title :string, body : any, userId : number }>({
            // url: '/posts',
            // method:'POST',
            // body :
            
            query:(arg: any)=>({
                url : '/posts',
                method : 'POST' ,
                body : arg

            }),
            invalidatesTags:['Post'],
        }),
        updatePost: builder.mutation<Post, { title: string; body: string; id: number }>({
            // url: '/posts',
            // method:'POST',
            // body :
            
            query:({id, title, body})=>({
                url : `/posts/${id}`,
                method : 'PUT' ,
                body : { title, body}

            }),
            invalidatesTags:['Post'],
        }),
        deletePost: builder.mutation<void, number>({
            // url: '/posts',
            // method:'POST',
            // body :
            
            query:(id)=>({
                url : `/posts/${id}`,
                method : 'DELETE' ,

            }),
            invalidatesTags:['Post'],
        }),

    }),
})
export const {useGetPostsQuery, useCreatePostMutation, useUpdatePostMutation, useDeletePostMutation} = postApi;