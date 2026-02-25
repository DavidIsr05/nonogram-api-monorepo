import {
  CreateNonogramRequestDto,
  GenerateNonogramDto,
  GeneratedNonogramResponseDto,
  NonogramResponseDto,
} from '@nonogram-api-monorepo/types';
import { api } from './api';

export const nonogramApi = api.injectEndpoints({
  endpoints: (build) => ({
    generateNonogram: build.query<
      GeneratedNonogramResponseDto,
      GenerateNonogramDto
    >({
      query: (body) => ({
        url: 'nonogram/generate',
        method: 'POST',
        body,
      }),
    }),
    createNonogram: build.query<NonogramResponseDto, CreateNonogramRequestDto>({
      query: (body) => ({
        url: 'nonogram/create',
        method: 'POST',
        body,
      }),
    }),
    getNonogramLeaders: build.query<[], string>({
      //TODO maybe make type for this
      query: (nonogramId) => ({
        url: `nonogram/leaders/${nonogramId}`,
        method: 'GET',
      }),
      providesTags: ['Game'],
    }),
    getGlobalLeaders: build.query<Record<string, number>[], void>({
      query: () => ({
        url: 'nonogram/global-leaders',
        method: 'GET',
      }),
      providesTags: ['Game'],
    }),
    getAllAvaliableNonograms: build.query<NonogramResponseDto[], string>({
      query: (userId) => ({
        url: `nonogram/all/${userId}`,
        method: 'GET',
      }),
      providesTags: ['Nonogram'],
    }),
    getUnplayedNonograms: build.query<NonogramResponseDto[], string>({
      query: (userId) => ({
        url: `nonogram/unplayed/${userId}`,
        method: 'GET',
      }),
      providesTags: ['Nonogram', 'Game'],
    }),
    getNonogram: build.query<NonogramResponseDto, string>({
      query: (nonogramId) => ({
        url: `nonogram/${nonogramId}`,
        method: 'GET',
      }),
      providesTags: ['Nonogram'],
    }),
  }),
});

export const {
  useLazyGenerateNonogramQuery,
  useLazyCreateNonogramQuery,
  useGetNonogramLeadersQuery,
  useGetGlobalLeadersQuery,
  useGetAllAvaliableNonogramsQuery,
  useGetUnplayedNonogramsQuery,
  useGetNonogramQuery,
} = nonogramApi;
