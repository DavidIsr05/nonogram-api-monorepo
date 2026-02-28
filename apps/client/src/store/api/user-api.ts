import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from '@nonogram-api-monorepo/types';
import { api } from './api';

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    signup: build.query<UserResponseDto, CreateUserDto>({
      query: (body) => ({
        url: 'user/signup',
        method: 'POST',
        body,
      }),
    }),
    getUserById: build.query<UserResponseDto, string>({
      query: (userId) => ({
        url: `user/${userId}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    updateUser: build.query<UserResponseDto, UpdateUserDto>({
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
