import {
  CheckAndUpdateInProgressNonogramType,
  CheckNonogramResponseType,
  CreateGameType,
  GameType,
  GameResponseType,
  FinishedGamesResponseType,
  GameWithCluesResponseType,
  UpdateGameType,
  NonogramLeadersResponseType,
} from '@nonogram-api-monorepo/types';
import { api } from './api';

export const gameApi = api.injectEndpoints({
  endpoints: (build) => ({
    createGame: build.mutation<GameType, CreateGameType>({
      query: (body) => ({
        url: 'game',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Game'],
    }),
    getAllUsersGames: build.query<GameType[], string>({
      query: (userId) => ({
        url: `game/all/${userId}`,
        method: 'GET',
      }),
      providesTags: ['Game'],
    }),
    getInProgresGames: build.query<GameResponseType[], string>({
      query: (userId) => ({
        url: `game/in-progress/${userId}`,
        method: 'GET',
      }),
      providesTags: ['Game'],
    }),
    getFinishedGames: build.query<FinishedGamesResponseType[], string>({
      query: (userId) => ({
        url: `game/finished/${userId}`,
        method: 'GET',
      }),
      providesTags: ['Game'],
    }),
    getGameById: build.query<GameWithCluesResponseType, string>({
      query: (gameId) => ({
        url: `game/${gameId}`,
        method: 'GET',
      }),
      providesTags: ['Game'],
    }),
    updateGame: build.mutation<GameType, UpdateGameType>({
      query: (body) => ({
        url: `game`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Game'],
    }),
    deleteGame: build.mutation<boolean, string>({
      query: (gameId) => ({
        url: `game/${gameId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Game'],
    }),
    checkAndUpdateInProgressNonogram: build.mutation<
      CheckNonogramResponseType,
      CheckAndUpdateInProgressNonogramType
    >({
      query: (body) => ({
        url: 'game/check-nonogram',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Game'],
    }),
    getNonogramLeaders: build.query<NonogramLeadersResponseType, string>({
      query: (nonogramId) => ({
        url: `game/leaders/${nonogramId}`,
        method: 'GET',
      }),
      providesTags: ['Game', 'Nonogram'],
    }),
  }),
});

export const {
  useCreateGameMutation,
  useGetAllUsersGamesQuery,
  useGetInProgresGamesQuery,
  useGetFinishedGamesQuery,
  useGetGameByIdQuery,
  useUpdateGameMutation,
  useDeleteGameMutation,
  useCheckAndUpdateInProgressNonogramMutation,
  useGetNonogramLeadersQuery,
} = gameApi;
