import { configureStore } from '@reduxjs/toolkit';
import { adminApi } from './api/adminApi';
import { productsApi } from './api/productsApi';
import { blogsApi } from './api/blogsApi';
import { authApi } from './api/authApi';
import { appointmentsApi } from './api/appointmentsApi';
import { servicesApi } from './api/servicesApi';
import { settingsApi } from './api/settingsApi';
import { mailingApi } from './api/mailingApi';
import { clientsApi } from './api/clientsApi';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [adminApi.reducerPath]: adminApi.reducer,
      [productsApi.reducerPath]: productsApi.reducer,
      [blogsApi.reducerPath]: blogsApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
      [appointmentsApi.reducerPath]: appointmentsApi.reducer,
      [servicesApi.reducerPath]: servicesApi.reducer,
      [settingsApi.reducerPath]: settingsApi.reducer,
      [mailingApi.reducerPath]: mailingApi.reducer,
      [clientsApi.reducerPath]: clientsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            adminApi.util.getRunningQueriesThunk.type,
            productsApi.util.getRunningQueriesThunk.type,
            blogsApi.util.getRunningQueriesThunk.type,
            authApi.util.getRunningQueriesThunk.type,
            appointmentsApi.util.getRunningQueriesThunk.type,
            servicesApi.util.getRunningQueriesThunk.type,
            settingsApi.util.getRunningQueriesThunk.type,
            mailingApi.util.getRunningQueriesThunk.type,
            clientsApi.util.getRunningQueriesThunk.type,
          ],
        },
      }).concat(
        adminApi.middleware,
        productsApi.middleware,
        blogsApi.middleware,
        authApi.middleware,
        appointmentsApi.middleware,
        servicesApi.middleware,
        settingsApi.middleware,
        mailingApi.middleware,
        clientsApi.middleware
      ),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
