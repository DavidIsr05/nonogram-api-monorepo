import { api } from './api';
import { UserSignInDto } from '../../../../../libs/types/src/lib/types';

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.query<{ access_token: string }, UserSignInDto>({
      query: (body) => ({
        url: 'auth/login',
        method: 'POST',
        body: body,
      }),
    }),
  }),
});

export const { useLoginQuery } = authApi;
