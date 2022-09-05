import { Box, Stack, TextField, Button } from "@mui/material";
import { useState } from "react";
import { withFirebaseApi, WithFirebaseApiProps } from "../../Firebase";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { handleCreateTweet } from "../../redux/mainFeedSlice";
import { RootState } from "../../redux/store";

const CreateTweetFormBase = (props: WithFirebaseApiProps) => {
  const currentUserId = useAppSelector((state: RootState) => state.session.userId);
  const dispatch = useAppDispatch();
  const [tweetContent, setTweetContent] = useState<string>('');

  const onSubmit = () => {
    dispatch(handleCreateTweet(props.firebaseApi, currentUserId!, tweetContent));
    setTweetContent("");
  };

  return (
    <Box sx={{ margin: "auto" }}>
      <Stack direction="row" spacing={2} justifyContent="center">
        <TextField
          id="tweet-input"
          label="Tweet"
          variant="outlined"
          onChange={(e) => setTweetContent(e.target.value)} value={tweetContent}
        />
        <Button variant="outlined" onClick={onSubmit}>Submit</Button>
      </Stack>
    </Box>
  );
};

export default withFirebaseApi(CreateTweetFormBase);
