import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { withFirebaseApi, WithFirebaseApiProps } from "../Firebase";
import { TweetWithId, UserInfo } from "../types";

const TweetBase = (props: {
  tweet: TweetWithId,
} & WithFirebaseApiProps) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  useEffect(() => {
    props.firebaseApi.asyncGetUserInfo(props.tweet.userId).then((userInfo) => {
      setUserInfo(userInfo);
    });
  }, []);
  return (
    <Box sx={{margin: 5}}>
      <Typography variant="body1" component="div" align="left">
        {userInfo?.username ?? <CircularProgress />}
      </Typography>
      <Typography variant="body1" component="div" align="left">
        {props.tweet.tweetContent}
      </Typography>
    </Box>
  );
};

export default withFirebaseApi(TweetBase);
