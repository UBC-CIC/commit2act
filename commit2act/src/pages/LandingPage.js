import { Typography } from '@mui/material';
import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';

const LandingPage = () => {
  const [user, setUser] = useState();

  const getUserInfo = async () => {
    const userInfo = await Auth.currentUserInfo();
    setUser(userInfo);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <>
      {user && (
        <Typography variant="h4">
          Welcome {user.attributes.name}! You are a{' '}
          {user.attributes['custom:user_type']}
        </Typography>
      )}
    </>
  );
};

export default LandingPage;
