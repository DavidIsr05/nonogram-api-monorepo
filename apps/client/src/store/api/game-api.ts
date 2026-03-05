import {
  CheckAndUpdateInProgressNonogramDto,
  CheckNonogramResponseDto,
  CreateGameDto,
  GameDto,
  GameResponseDto,
  GameWithCluesResponseDto,
  UpdateGameDto,
} from '@nonogram-api-monorepo/types';
import { api } from './api';

export const gameApi = api.injectEndpoints({
  endpoints: (build) => ({
    createGame: build.mutation<GameDto, CreateGameDto>({
      query: (body) => ({
        url: 'game',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Game'],
    }),
    getAllUsersGames: build.query<GameDto[], string>({
      query: (userId) => ({
        url: `game/all/${userId}`,
        method: 'GET',
      }),
      providesTags: ['Game'],
    }),
    getInProgresGames: build.query<GameResponseDto[], string>({
      query: (userId) => ({
        url: `game/in-progress/${userId}`,
        method: 'GET',
      }),
      providesTags: ['Game'],
    }),
    getFinishedGames: build.query<GameDto[], string>({
      query: (userId) => ({
        url: `game/finished/${userId}`,
        method: 'GET',
      }),
      providesTags: ['Game'],
    }),
    getGameById: build.query<GameWithCluesResponseDto, string>({
      query: (gameId) => ({
        url: `game/${gameId}`,
        method: 'GET',
      }),
      providesTags: ['Game'],
    }),
    updateGame: build.mutation<GameDto, UpdateGameDto>({
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
      CheckNonogramResponseDto,
      CheckAndUpdateInProgressNonogramDto
    >({
      query: (body) => ({
        url: 'game/check-nonogram',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Game'],
    }),
  }),
});

export const {
  useCreateGameMutation,
  useGetAllUsersGamesQuery,
  useGetInProgresGamesQuery,
  useLazyGetFinishedGamesQuery,
  useGetGameByIdQuery,
  useUpdateGameMutation,
  useDeleteGameMutation,
  useCheckAndUpdateInProgressNonogramMutation,
} = gameApi;
