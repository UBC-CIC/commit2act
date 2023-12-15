import React from 'react';
import { Box, Typography } from '@mui/material';
import useTranslation from '../components/customHooks/translations';
import UserActions from '../components/UserActions';
import { useUserInfoContext } from '../hooks/use-user-info-context';

const Actions = () => {
  const translation = useTranslation();
  const { user } = useUserInfoContext();
  return (
    <>
      <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
        <Typography variant="h1" sx={{ m: '0 0 1.25em' }}>
          {translation.myActions}
        </Typography>
        <UserActions databaseUser={user} />
      </Box>
    </>
  );
};

export default Actions;
