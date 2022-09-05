import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { withFirebaseApi, WithFirebaseApiProps } from "../../Firebase";
import ErrorPage from "../ErrorPage";
import LoadingPage from "../LoadingPage";
import Tweet from "../../components/Tweet";
import { useParams } from "react-router-dom";
import { TweetWithId } from "../../types";
import ProfileCard from "./ProfileCard";

const ProfileFeedBase = (props: WithFirebaseApiProps) => {
  const params = useParams();
  const [tweetWithIdList, setTweetWithIdList] = useState<Array<TweetWithId>>([]);
  const [fetchStatus, setFetchStatus] = useState<'idle' | 'loading' | 'failed'>('loading');

  useEffect(() => {
    if (params.userId == null) {
      setTweetWithIdList([]);
      setFetchStatus('idle');
      return;
    }
    setTweetWithIdList([]);
    setFetchStatus('loading');
    props.firebaseApi.asyncGetProfileFeed(params.userId!).then((tweetWithIdList) => {
      setFetchStatus('idle');
      setTweetWithIdList(tweetWithIdList);
    }).catch((err) => {
      console.log(err);
      setFetchStatus('failed');
    });
  }, [params.userId]);

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

const ProfileFeed = withFirebaseApi(ProfileFeedBase);

export default () => {
  return (<>
    <ProfileCard />
    <ProfileFeed />
  </>);
};
