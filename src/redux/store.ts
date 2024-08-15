import {
    ThunkAction,
    Action,
    combineReducers,
    Tuple
} from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { configureStore} from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { staticReducers, rtkQueryMiddleware } from './reducers';

const persistConfig = {
    key: 'tausiapp',
    storage,
    version: 1,
};

const rootReducer = () => combineReducers(staticReducers);

const persistedReducer = persistReducer(persistConfig, rootReducer());
export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(rtkQueryMiddleware as Tuple),
});

export const persistor = persistStore(store);
setupListeners(store.dispatch)

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
