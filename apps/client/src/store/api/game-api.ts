import {
  CheckAndUpdateInProgressNonogramDto,
  CreateGameDto,
  TileStates,
  UpdateGameDto,
} from '@nonogram-api-monorepo/types';
import { api } from './api';
import { Game } from '../../../../server/src/modules/game/entity/game.entity';

export const gameApi = api.injectEndpoints({
  endpoints: (build) => ({
    createGame: build.query<Game, CreateGameDto>({
      query: (body) => ({
        url: 'game',
        method: 'POST',
        body,
      }),
    }),
    getAllUsersGames: build.query<Game[], void>({
      query: (userId) => ({
        url: `game/all/${userId}`,
        method: 'GET',
      }),
      providesTags: ['Game'],
    }),
    getInProgresGames: build.query<Game[], void>({
      query: (userId) => ({
        url: `game/in-progress/${userId}`,
        method: 'GET',
      }),
      providesTags: ['Game'],
    }),
    getFinishedGames: build.query<Game[], void>({
      query: (userId) => ({
        url: `game/finished/${userId}`,
        method: 'GET',
      }),
      providesTags: ['Game'],
    }),
    getGameById: build.query<Game, void>({
      query: (userId) => ({
        url: `game/${userId}`,
        method: 'GET',
      }),
      providesTags: ['Game'],
    }),
    updateGame: build.query<Game, UpdateGameDto>({
      query: (body) => ({
        url: `game`,
        method: 'PATCH',
        body,
      }),
    }),
    deleteGame: build.query<boolean, void>({
      query: (gameId) => ({
        url: `game/${gameId}`,
        method: 'DELETE',
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
  useLazyGetInProgresGamesQuery,
  useLazyGetFinishedGamesQuery,
  useGetGameByIdQuery,
  useLazyUpdateGameQuery,
  useLazyDeleteGameQuery,
  useCheckAndUpdateInProgressNonogramQuery,
} = gameApi;
