import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import { userReducer } from './slices';

export const store = configureStore({
  reducer: { [api.reducerPath]: api.reducer, user: userReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
