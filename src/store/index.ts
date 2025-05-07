import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import jobsReducer from './slices/jobsSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    jobs: jobsReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;