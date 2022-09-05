import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from './store';
import { FirebaseApi } from '../Firebase';

export interface UserInfo {
  username: string;
};

export interface WithLoadingState {
  status: 'idle' | 'loading' | 'failed';
};

export interface SessionState {
  userId: string | null | undefined;
  userInfo: {
    value: UserInfo | null | undefined,
  } & WithLoadingState;
}

const initialState: SessionState = {
  userId: undefined,
  userInfo: {
    value: undefined,
    status: 'idle',
  },
};

export const asyncFetchUserInfo = createAsyncThunk(
  'session/fetchUserInfo',
  async (action: { firebaseApi: FirebaseApi, userId: string }) => {
    return await action.firebaseApi.asyncGetUserInfo(action.userId);
  }
);

export const asyncSetUserInfo = createAsyncThunk(
  'session/setUserInfo',
  async (action: { firebaseApi: FirebaseApi, userId: string, userInfo: UserInfo }) => {
    return await action.firebaseApi.asyncSetUserInfo(action.userId, action.userInfo);
  }
);

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string | null>) => {
      state.userId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncFetchUserInfo.pending, (state) => {
        state.userInfo.value = undefined;
        state.userInfo.status = 'loading';
      })
      .addCase(asyncFetchUserInfo.fulfilled, (state, action) => {
        state.userInfo.value = action.payload;
        state.userInfo.status = 'idle';
      })
      .addCase(asyncFetchUserInfo.rejected, (state) => {
        state.userInfo.value = undefined;
        state.userInfo.status = 'failed';
      })
      .addCase(asyncSetUserInfo.pending, (state) => {
        state.userInfo.value = undefined;
        state.userInfo.status = 'loading';
      })
      .addCase(asyncSetUserInfo.fulfilled, (state, action) => {
        state.userInfo.value = action.payload;
        state.userInfo.status = 'idle';
      })
      .addCase(asyncSetUserInfo.rejected, (state) => {
        state.userInfo.value = undefined;
        state.userInfo.status = 'failed';
      });
  },
});

export const { setUserId } = sessionSlice.actions;

export const handleSessionChange =
  (firebaseApi: FirebaseApi, userId: string | null): AppThunk =>
    (dispatch, getState) => {
      if (userId === getState().session.userId) {
        return;
      }
      dispatch(setUserId(userId));
      if (userId === null || userId === undefined) {
        return;
      }
      dispatch(asyncFetchUserInfo({ firebaseApi, userId }));
    };

export default sessionSlice.reducer;
