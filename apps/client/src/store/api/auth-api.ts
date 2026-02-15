import { api } from './api';
import { UserSignInDto } from '../../../../../libs/types/src/lib/types';

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.query<string, UserSignInDto>({
      query: () => ({
        url: 'auth/login',
        method: 'POST',
      }),
    }),
  }),
});

export const { useLoginQuery } = authApi;
