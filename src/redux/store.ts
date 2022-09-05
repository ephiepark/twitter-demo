import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import sessionReducer from './sessionSlice';
import mainFeedReducer from './mainFeedSlice';

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    mainFeed: mainFeedReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
