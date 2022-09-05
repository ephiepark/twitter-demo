import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from './store';
import { FirebaseApi } from '../Firebase';
import { TweetWithId, WithLoadingState } from '../types';


export interface MainFeedState {
  createTweet: WithLoadingState,
  mainFeed: {
    value: Array<TweetWithId>
  } & WithLoadingState;
}

const initialState: MainFeedState = {
  createTweet: {
    status: 'idle'
  },
  mainFeed: {
    value: [],
    status: 'idle',
  }
};

export const asyncGetMainFeed = createAsyncThunk(
  'mainFeed/getMainFeed',
  async (action: { firebaseApi: FirebaseApi, userId: string, following: Array<string> }) => {
    return await action.firebaseApi.asyncGetMainFeed(action.userId, action.following);
  }
);

export const mainFeedSlice = createSlice({
  name: 'mainFeed',
  initialState,
  reducers: {
    setCreateTweetStatus: (state, action: PayloadAction<'idle' | 'loading' | 'failed'>) => {
      state.createTweet.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncGetMainFeed.pending, (state) => {
        state.mainFeed.value = [];
        state.mainFeed.status = 'loading';
      })
      .addCase(asyncGetMainFeed.fulfilled, (state, action) => {
        state.mainFeed.value = action.payload;
        state.mainFeed.status = 'idle';
      })
      .addCase(asyncGetMainFeed.rejected, (state) => {
        state.mainFeed.value = [];
        state.mainFeed.status = 'failed';
      });
  },
});

export const { setCreateTweetStatus } = mainFeedSlice.actions;

export const handleCreateTweet =
  (firebaseApi: FirebaseApi, userId: string, tweetContent: string): AppThunk =>
    async (dispatch, getState) => {
      const following = getState().session.userInfo.value!.following;
      dispatch(setCreateTweetStatus('loading'));
      firebaseApi.asyncCreateTweet(
        userId,
        tweetContent,
      ).then(() => {
        dispatch(setCreateTweetStatus('idle'));
        dispatch(asyncGetMainFeed({ firebaseApi, userId, following }));
      }).catch(() => {
        dispatch(setCreateTweetStatus('failed'));
      });

    };

export default mainFeedSlice.reducer;
