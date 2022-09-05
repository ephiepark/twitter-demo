import { UserInfo } from "../../types";
import { useState, useEffect } from "react";
import { withFirebaseApi, WithFirebaseApiProps } from "../../Firebase";
import { CircularProgress, Typography } from "@mui/material";

const ProfileCardBase = (props: {
  userId: string
} & WithFirebaseApiProps) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  useEffect(() => {
    props.firebaseApi.asyncGetUserInfo(props.userId).then((userInfo) => {
      setUserInfo(userInfo);
    });
  }, []);
  if (userInfo === null) {
    return <CircularProgress />;
  }
  return (<>
    <Typography>
      {'Username: ' + userInfo.username}
    </Typography>
  </>);
};

export default withFirebaseApi(ProfileCardBase);
