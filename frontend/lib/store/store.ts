import { configureStore } from '@reduxjs/toolkit';
import { adminApi } from './api/adminApi';
import { productsApi } from './api/productsApi';
import { blogsApi } from './api/blogsApi';
import { authApi } from './api/authApi';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [adminApi.reducerPath]: adminApi.reducer,
      [productsApi.reducerPath]: productsApi.reducer,
      [blogsApi.reducerPath]: blogsApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            adminApi.util.getRunningQueriesThunk.type,
            productsApi.util.getRunningQueriesThunk.type,
            blogsApi.util.getRunningQueriesThunk.type,
            authApi.util.getRunningQueriesThunk.type,
          ],
        },
      }).concat(adminApi.middleware, productsApi.middleware, blogsApi.middleware, authApi.middleware),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

