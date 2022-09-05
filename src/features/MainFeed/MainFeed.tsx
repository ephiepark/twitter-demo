import { Box } from "@mui/material";
import { useEffect } from "react";
import { withFirebaseApi, WithFirebaseApiProps } from "../../Firebase";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { asyncGetMainFeed } from "../../redux/mainFeedSlice";
import { RootState } from "../../redux/store";
import ErrorPage from "../ErrorPage";
import LoadingPage from "../LoadingPage";

const MainFeedBase = (props: WithFirebaseApiProps) => {
  const currentUserId = useAppSelector((state: RootState) => state.session.userId);
  const tweetWithIdList = useAppSelector((state: RootState) => state.mainFeed.mainFeed.value);
  const fetchStatus = useAppSelector((state: RootState) => state.mainFeed.mainFeed.status);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(asyncGetMainFeed({
      firebaseApi: props.firebaseApi,
      userId: currentUserId!
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
        return (<li key={tweet.id}>{tweet.tweetContent}</li>);
      })}
    </Box>
  );
};

export default withFirebaseApi(MainFeedBase);
