import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { withFirebaseApi, WithFirebaseApiProps } from "../../Firebase";
import ErrorPage from "../ErrorPage";
import LoadingPage from "../LoadingPage";
import Tweet from "../../components/Tweet";
import { useParams } from "react-router-dom";
import { TweetWithId } from "../../types";
import ProfileCard from "./ProfileCard";

const ProfileFeedBase = (props: {userId: string} & WithFirebaseApiProps) => {
  const [tweetWithIdList, setTweetWithIdList] = useState<Array<TweetWithId>>([]);
  const [fetchStatus, setFetchStatus] = useState<'idle' | 'loading' | 'failed'>('loading');

  useEffect(() => {
    setTweetWithIdList([]);
    setFetchStatus('loading');
    props.firebaseApi.asyncGetProfileFeed(props.userId!).then((tweetWithIdList) => {
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

const ProfileFeed = withFirebaseApi(ProfileFeedBase);

export default () => {
  const params = useParams();
  if (params.userId == null) {
    return <ErrorPage />;
  }
  return (<>
    <ProfileCard userId={params.userId} />
    <ProfileFeed userId={params.userId} />
  </>);
};
