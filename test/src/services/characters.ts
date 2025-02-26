import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const charactersApi = createApi({
  reducerPath: "charactersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://rickandmortyapi.com/api/character" }),
  endpoints: (builder) => ({
    getCharacters: builder.query<any, void>({
        query: () => "",
    })
  }),
});


export const { useGetCharactersQuery } = charactersApi;