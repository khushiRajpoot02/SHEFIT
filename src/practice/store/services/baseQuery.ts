// what is fetchBaseQuery ? 

// fetchBaseQuery = axios.create((baseUrl, headers))
//// it is a function that takes base url 
// takes prepared headers
// return a fucntion RTK query will call for every request


import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const rawBaseQuery = fetchBaseQuery({
    baseUrl : 'https://jsonplaceholder.typicode.com',
    prepareHeaders : (headers)=>{
        // attach toke
        const token = 'test-token-123';
        if(token){
            headers.set('Authorization', `Bearer ${token}`)
        }
        return headers;
    }
});

export const baseQueryWithReauth = rawBaseQuery;

