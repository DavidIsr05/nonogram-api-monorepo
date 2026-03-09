import {
  CreateUserType,
  UpdateUserType,
  UserResponseType,
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
    updateUser: build.query<UserResponseType, UpdateUserType>({
      query: (body) => ({
        url: 'user',
        method: 'PATCH',
        body,
      }),
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
  useLazyUpdateUserQuery,
  useLazyDeleteQuery,
} = userApi;
