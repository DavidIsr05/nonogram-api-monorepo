import { api } from './api';
import { UserSignInType } from '@nonogram-api-monorepo/types';

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.query<
      { access_token: string; userId: string },
      UserSignInType
    >({
      query: (body) => ({
        url: 'auth/login',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useLazyLoginQuery } = authApi;
