import { Nonogram } from './../../../../server/src/modules/nonogram/entity/nonogram.entity';
import {
  CreateNonogramRequestDto,
  GenerateNonogramDto,
  GeneratedNonogramResponseDto,
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
        body: body,
      }),
    }),
    createNonogram: build.query<
      void /*TODO need to add logic for clean object return so user wont access the solved nonogram */,
      CreateNonogramRequestDto
    >({
      query: (body) => ({
        url: 'nonogram/create',
        method: 'POST',
        body: body,
      }),
    }),
    getNonogramLeaders: build.query<Nonogram[] /* here as well */, void>({
      query: (nonogramId) => ({
        url: `nonogram/leaders/${nonogramId}`,
        method: 'GET',
      }),
    }),
    getGlobalLeaders: build.query<void /*TODO!!!*/, void>({
      query: () => ({
        url: 'nonogram/global-leaders',
        method: 'GET',
      }),
    }),
    getAllAvaliableNonograms: build.query<Nonogram[], void>({
      query: (userId) => ({
        url: `nonogram/all/${userId}`,
        method: 'GET',
      }),
    }),
    getUnplayedNonograms: build.query<Nonogram[], void>({
      query: (userId) => ({
        url: `nonogram/unplayed/${userId}`,
        method: 'GET',
      }),
    }),
    getNonogram: build.query<Nonogram, void>({
      query: (nonogramId) => ({
        url: `nonogram/${nonogramId}`,
        method: 'GET',
      }),
    }),
  }),
});
