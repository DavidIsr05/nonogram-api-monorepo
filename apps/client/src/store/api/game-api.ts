import {
  CheckAndUpdateInProgressNonogramDto,
  CreateGameDto,
  GameDto,
  GameResponseDto,
  TileStates,
  UpdateGameDto,
} from '@nonogram-api-monorepo/types';
import { api } from './api';

export const gameApi = api.injectEndpoints({
  endpoints: (build) => ({
    createGame: build.query<GameDto, CreateGameDto>({
      query: (body) => ({
        url: 'game',
        method: 'POST',
        body,
      }),
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
    getGameById: build.query<GameDto, string>({
      query: (userId) => ({
        url: `game/${userId}`,
        method: 'GET',
      }),
      providesTags: ['Game'],
    }),
    updateGame: build.query<GameDto, UpdateGameDto>({
      query: (body) => ({
        url: `game`,
        method: 'PATCH',
        body,
      }),
    }),
    deleteGame: build.query<boolean, string>({
      query: (gameId) => ({
        url: `game/${gameId}`,
        method: 'DELETE',
      }),
    }),
    toggleLike: build.mutation<GameDto, string>({
      query: (gameId) => ({
        url: `game/${gameId}/like`,
        method: 'PATCH',
      }),
    }),
    checkAndUpdateInProgressNonogram: build.query<
      TileStates[][],
      CheckAndUpdateInProgressNonogramDto
    >({
      query: (body) => ({
        url: 'game/check-nonogram',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useLazyCreateGameQuery,
  useGetAllUsersGamesQuery,
  useGetInProgresGamesQuery,
  useLazyGetFinishedGamesQuery,
  useGetGameByIdQuery,
  useLazyUpdateGameQuery,
  useLazyDeleteGameQuery,
  useToggleLikeMutation,
  useCheckAndUpdateInProgressNonogramQuery,
} = gameApi;
