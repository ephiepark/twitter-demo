import { UserInfo } from "../../types";
import { useState, useEffect } from "react";
import { withFirebaseApi, WithFirebaseApiProps } from "../../Firebase";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { handleUnfollow, handleFollow } from "../../redux/sessionSlice";

const ProfileCardBase = (props: {
  userId: string
} & WithFirebaseApiProps) => {
  const currentUserId = useAppSelector((state: RootState) => state.session.userId);
  const currentUserInfo = useAppSelector((state: RootState) => state.session.userInfo.value);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    props.firebaseApi.asyncGetUserInfo(props.userId).then((userInfo) => {
      setUserInfo(userInfo);
    });
  }, []);
  if (userInfo === null) {
    return <CircularProgress />;
  }
  let button = null;
  if (currentUserId !== props.userId) {
    const isFollowing = currentUserInfo!.following.includes(props.userId);
    button = isFollowing ? <Button onClick={() => {
      dispatch(handleUnfollow(props.firebaseApi, currentUserId!, props.userId))
    }}>Unfollow</Button> : <Button onClick={() => {
      dispatch(handleFollow(props.firebaseApi, currentUserId!, props.userId))
    }}>Follow</Button>
  }

  return (<>
    <Typography>
      {'Username: ' + userInfo.username}
    </Typography>
    {button}
  </>);
};

export default withFirebaseApi(ProfileCardBase);
