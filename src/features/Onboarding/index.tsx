import { Typography, Stack, TextField, Button } from "@mui/material";
import { useState } from "react";
import { WithFirebaseApiProps, withFirebaseApi } from "../../Firebase";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { asyncSetUserInfo } from "../../redux/sessionSlice";
import { RootState } from "../../redux/store";

const OnboardingPageBase = (
  props: WithFirebaseApiProps
) => {
  const currentUserId = useAppSelector((state: RootState) => state.session.userId);
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState<string>('');
  return (<>
    <Typography variant="h2" component="div" align="left">
      Finish setting up your account
    </Typography>
    <Stack direction="row" spacing={2}>
      <Typography variant="body1" align="left" sx={{ marginTop: "auto", marginBottom: "auto" }}>
        Username:
      </Typography>
      <TextField
        value={username}
        label="Edit Username"
        onChange={(e) => setUsername(e.target.value)}
      />
    </Stack>
    <Button
      variant="contained"
      sx={{ marginTop: 2 }}
      onClick={() => dispatch(asyncSetUserInfo({
        firebaseApi: props.firebaseApi,
        userId: currentUserId!,
        userInfo: { username: username }
      }))}
    >SUBMIT</Button>
  </>);
};

export default withFirebaseApi(OnboardingPageBase);
