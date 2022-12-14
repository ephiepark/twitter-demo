import { Box } from "@mui/material";
import { useEffect } from "react";
import { withFirebaseApi, WithFirebaseApiProps } from "../../Firebase";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { asyncGetMainFeed } from "../../redux/mainFeedSlice";
import { RootState } from "../../redux/store";
import ErrorPage from "../ErrorPage";
import LoadingPage from "../LoadingPage";
import Tweet from "../../components/Tweet";

const MainFeedBase = (props: WithFirebaseApiProps) => {
  const currentUserId = useAppSelector((state: RootState) => state.session.userId);
  const currentUserInfo = useAppSelector((state: RootState) => state.session.userInfo.value);
  const tweetWithIdList = useAppSelector((state: RootState) => state.mainFeed.mainFeed.value);
  const fetchStatus = useAppSelector((state: RootState) => state.mainFeed.mainFeed.status);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(asyncGetMainFeed({
      firebaseApi: props.firebaseApi,
      userId: currentUserId!,
      following: currentUserInfo!.following,
    }));
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

export default withFirebaseApi(MainFeedBase);
