import {
  CreateNonogramRequestType,
  GenerateNonogramType,
  GeneratedNonogramResponseType,
  NonogramLeadersResponseType,
  NonogramResponseType,
} from '@nonogram-api-monorepo/types';
import { api } from './api';

export const nonogramApi = api.injectEndpoints({
  endpoints: (build) => ({
    generateNonogram: build.mutation<
      GeneratedNonogramResponseType,
      GenerateNonogramType
    >({
      query: (body) => ({
        url: 'nonogram/generate',
        method: 'POST',
        body,
      }),
    }),
    createNonogram: build.mutation<
      NonogramResponseType,
      CreateNonogramRequestType
    >({
      query: (body) => ({
        url: 'nonogram/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Nonogram'],
    }),
    getNonogramLeaders: build.query<NonogramLeadersResponseType, string>({
      query: (nonogramId) => ({
        url: `nonogram/leaders/${nonogramId}`,
        method: 'GET',
      }),
      providesTags: ['Game', 'Nonogram'],
    }),
    getGlobalLeaders: build.query<Record<string, number>[], void>({
      query: () => ({
        url: 'nonogram/global-leaders',
        method: 'GET',
      }),
      providesTags: ['Game'],
    }),
    getAllAvaliableNonograms: build.query<NonogramResponseType[], string>({
      query: (userId) => ({
        url: `nonogram/all/${userId}`,
        method: 'GET',
      }),
      providesTags: ['Nonogram'],
    }),
    getUnplayedNonograms: build.query<NonogramResponseType[], string>({
      query: (userId) => ({
        url: `nonogram/unplayed/${userId}`,
        method: 'GET',
      }),
      providesTags: ['Nonogram', 'Game'],
    }),
    getNonogram: build.query<NonogramResponseType, string>({
      query: (nonogramId) => ({
        url: `nonogram/${nonogramId}`,
        method: 'GET',
      }),
      providesTags: ['Nonogram'],
    }),
  }),
});

export const {
  useGenerateNonogramMutation,
  useCreateNonogramMutation,
  useGetNonogramLeadersQuery,
  useGetGlobalLeadersQuery,
  useGetAllAvaliableNonogramsQuery,
  useGetUnplayedNonogramsQuery,
  useLazyGetNonogramQuery,
} = nonogramApi;
