import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { withFirebaseApi, WithFirebaseApiProps } from "../../Firebase";
import ErrorPage from "../ErrorPage";
import LoadingPage from "../LoadingPage";
import Tweet from "../../components/Tweet";
import { useAppSelector } from "../../redux/hooks";
import { TweetWithId } from "../../types";
import { RootState } from "../../redux/store";

const ExploreFeedBase = (props: WithFirebaseApiProps) => {
  const currentUserId = useAppSelector((state: RootState) => state.session.userId);
  const [tweetWithIdList, setTweetWithIdList] = useState<Array<TweetWithId>>([]);
  const [fetchStatus, setFetchStatus] = useState<'idle' | 'loading' | 'failed'>('loading');

  useEffect(() => {
    setTweetWithIdList([]);
    setFetchStatus('loading');
    props.firebaseApi.asyncGetExploreFeed(currentUserId!).then((tweetWithIdList) => {
      setFetchStatus('idle');
      setTweetWithIdList(tweetWithIdList);
    }).catch((err) => {
      console.log(err);
      setFetchStatus('failed');
    });
  }, []);

  if (fetchStatus === 'loading') {
    return <LoadingPage />;
  }
  if (fetchStatus === 'failed') {
    return <ErrorPage />;
  }
  return (
    <Box sx={{ margin: "auto" }}>
      {tweetWithIdList.map((tweet) => {
        return (<Tweet key={tweet.id} tweet={tweet} />);
      })}
    </Box>
  );
};

const ExploreFeed = withFirebaseApi(ExploreFeedBase);

export default () => {
  return (<>
    <ExploreFeed />
  </>);
};
