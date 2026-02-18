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
        body: body,
      }),
    }),
    getUserById: build.query<UserResponseDto, void>({
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
        body: body,
      }),
    }),
    delete: build.query<boolean, void>({
      query: (userId) => ({
        url: `user/${userId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useSignupQuery,
  useGetUserByIdQuery,
  useUpdateUserQuery,
  useDeleteQuery,
} = userApi;
