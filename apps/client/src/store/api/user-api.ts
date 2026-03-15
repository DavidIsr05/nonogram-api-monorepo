import {
  CreateUserType,
  UpdateUserType,
  UserResponseType,
  UserStatsType,
} from '@nonogram-api-monorepo/types';
import { api } from './api';

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    signup: build.query<UserResponseType, CreateUserType>({
      query: (body) => ({
        url: 'user/signup',
        method: 'POST',
        body,
      }),
    }),
    getUserById: build.query<UserResponseType, string>({
      query: (userId) => ({
        url: `user/${userId}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    getUserStats: build.query<UserStatsType, void>({
      query: () => ({
        url: 'user/get-user-stats',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    updateUser: build.mutation<UserResponseType, UpdateUserType>({
      query: (body) => ({
        url: 'user',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    delete: build.query<boolean, string>({
      query: (userId) => ({
        url: `user/${userId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useLazySignupQuery,
  useGetUserByIdQuery,
  useGetUserStatsQuery,
  useUpdateUserMutation,
  useLazyDeleteQuery,
} = userApi;
