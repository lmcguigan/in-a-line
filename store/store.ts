import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  persistStore, 
  persistReducer,   
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import gameWinningsReducer from './gameWinningsSlice'
import settingsReducer from './settingsSlice'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}

const reducer = combineReducers({
  gameWinnings: gameWinningsReducer,
  settings: settingsReducer,
})

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch