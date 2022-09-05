import React, { useEffect } from 'react';

import { handleSessionChange } from './redux/sessionSlice';

// Import the functions you need from the SDKs you need
import { Box, Container } from '@mui/material';
import { withFirebaseApi, WithFirebaseApiProps } from './Firebase';

import { useAppSelector, useAppDispatch } from './redux/hooks';
import { RootState } from './redux/store';
import Header from './components/Header';
import LandingPage from './features/LandingPage';
import LoadingPage from './features/LoadingPage';
import ErrorPage from './features/ErrorPage';
import Onboarding from './features/Onboarding';
import MainFeed from './features/MainFeed';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import ProfileFeed from './features/ProfileFeed';
import ExploreFeed from './features/ExploreFeed';


const Body = () => {
  const currentUserId = useAppSelector((state: RootState) => state.session.userId);
  const currentUserInfo = useAppSelector((state: RootState) => state.session.userInfo.value);
  const currentUserInfoStatus = useAppSelector((state: RootState) => state.session.userInfo.status);
  if (currentUserId === null) {
    return <LandingPage />;
  }

  if (currentUserInfoStatus === "loading") {
    return <LoadingPage />;
  }
  if (currentUserInfoStatus === "failed") {
    return <ErrorPage />;
  }
  if (currentUserInfo === null) {
    return <Onboarding />;
  }
  return (
    <Routes>
      <Route path="/" element={<MainFeed />} />
      <Route path="/user/:userId" element={<ProfileFeed />} />
      <Route path="/explore" element={<ExploreFeed />} />
    </Routes>
  );
};

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
    <BrowserRouter>
      <Header />
      <Container sx={{ paddingTop: 3 }}>
        <Box sx={{ margin: "auto" }}>
          <Body />
        </Box>
      </Container>
    </BrowserRouter>
  );
}

export default withFirebaseApi(App);
