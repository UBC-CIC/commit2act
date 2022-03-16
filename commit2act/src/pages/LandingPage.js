import { Typography, Box, Button } from '@mui/material';
import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material';
import Section from '../components/Section';

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
        <Section>
          <Typography variant="h4">Welcome {user.attributes.name}!</Typography>
          <Typography variant="subtitle1" sx={{ margin: '40px 0 20px' }}>
            Recent Progress
          </Typography>
          <Box
            component="div"
            sx={{
              width: '100%',
              height: '50vh',
              backgroundColor: '#DBE2EF',
            }}
          />
          <Box
            component="div"
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '40px 0 20px',
            }}
          >
            <Typography variant="subtitle1">My Groups</Typography>
            <Button variant="contained">Create New Group</Button>
          </Box>
          <Box
            component="div"
            sx={{
              width: '100%',
              height: '50vh',
              backgroundColor: '#DBE2EF',
            }}
          />
        </Section>
      )}
    </>
  );
};

export default LandingPage;
