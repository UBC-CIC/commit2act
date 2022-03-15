import { Typography } from '@mui/material';
import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';

const LandingPage = () => {
  const [user, setUser] = useState();

  const getUserInfo = async () => {
    const userInfo = await Auth.currentUserInfo();
    console.log(userInfo);
    setUser(userInfo);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <>
      {user && (
        <Typography variant="h4">Welcome {user.attributes.name}!</Typography>
      )}
    </>
  );
};

export default LandingPage;
