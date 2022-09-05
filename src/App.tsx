import React, { useEffect, useState } from 'react';

import { asyncSetUserInfo, handleSessionChange } from './redux/sessionSlice';

// Import the functions you need from the SDKs you need
import { AppBar, Toolbar, Box, Button, CircularProgress, Stack, TextField, Typography, Container } from '@mui/material';
import { withFirebaseApi, WithFirebaseApiProps } from './Firebase';

import { useAppSelector, useAppDispatch } from './redux/hooks';
import { RootState } from './redux/store';


const HeaderBase = (
  props: WithFirebaseApiProps
) => {
  const currentUserId = useAppSelector((state: RootState) => state.session.userId);
  const loginWithGoogleButton = (
    <Button color="inherit" onClick={props.firebaseApi.signInWithGoogleRedirect}>Login with Google</Button>
  );
  const logoutButton = (
    <Button color="inherit" onClick={props.firebaseApi.signOut}>Log out</Button>
  );
  const button = currentUserId == null ? loginWithGoogleButton : logoutButton;
  return (
    <AppBar position="static">
      <Toolbar sx={{ width: "100%", maxWidth: 720, margin: "auto" }}>
        <Typography variant="h6" component="div">
          <Button color="inherit">LogInApp</Button>
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {button}
      </Toolbar>
    </AppBar>
  );
};

const Header = withFirebaseApi(HeaderBase);

const LoadingPage = () => {
  return (<>
    <CircularProgress sx={{ margin: "auto" }} />
  </>);
};

const ErrorPage = () => {
  return (<>
    <Typography variant="h2" component="div" align="left">
      Something failed...
    </Typography>
  </>)
}

const LogInPage = () => {
  return (<>
    <Typography variant="h2" component="div" align="left">
      Welcome to the log in page
    </Typography>
  </>);
};

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

const OnboardingPage = withFirebaseApi(OnboardingPageBase);

const BodyBase = (props: WithFirebaseApiProps) => {
  const currentUserId = useAppSelector((state: RootState) => state.session.userId);
  const currentUserInfo = useAppSelector((state: RootState) => state.session.userInfo.value);
  const currentUserInfoStatus = useAppSelector((state: RootState) => state.session.userInfo.status);
  if (currentUserId === null) {
    return <LogInPage />;
  }

  if (currentUserInfoStatus === "loading") {
    return <LoadingPage />;
  }
  if (currentUserInfoStatus === "failed") {
    return <ErrorPage />;
  }
  if (currentUserInfo === null) {
    return <OnboardingPage />;
  }
  return (
    <Typography variant="h2" component="div" align="left">
      Welcome to the home page
    </Typography>
  )
};

const Body = withFirebaseApi(BodyBase);

const isLoadingState = (state: RootState): boolean => {
  return state.session.userId === undefined;
};

const App = (props: WithFirebaseApiProps) => {
  const isLoading = useAppSelector(isLoadingState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return props.firebaseApi.onAuthStateChanged((user) => {
      if (user) {
        dispatch(handleSessionChange(props.firebaseApi, user.uid));
      } else {
        dispatch(handleSessionChange(props.firebaseApi, null));
      }
    });
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }
  return (
    <>
      <Header />
      <Container sx={{ paddingTop: 3 }}>
        <Box sx={{ margin: "auto" }}>
          <Body />
        </Box>
      </Container>
    </>
  );
}

export default withFirebaseApi(App);
