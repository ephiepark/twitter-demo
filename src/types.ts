export interface UserInfo {
  username: string;
  following: Array<string>;
};

export interface WithLoadingState {
  status: 'idle' | 'loading' | 'failed';
};

export interface WithId {
  id: string;
};

export interface Tweet {
  userId: string;
  tweetContent: string;
  createdTime: number;
};

export type TweetWithId = Tweet & WithId;
