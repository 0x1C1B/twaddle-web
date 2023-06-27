import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import privacySlice from './slices/privacy';

const persistConfig = {
  key: 'twaddle',
  version: 1,
  storage,
  whitelist: ['privacy'],
};

const rootReducer = combineReducers({
  privacy: privacySlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Required to prevent persistence in browser memory without user permissions by default
persistor.pause();

export default store;
