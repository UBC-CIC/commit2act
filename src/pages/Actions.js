import React, { useEffect, useState}  from 'react';

import {
  Box,
  Typography,
} from '@mui/material';
import useTranslation from '../components/customHooks/translations';
import UserActions from '../components/UserActions';

const Actions = ({user, userType}) => {
  const translation = useTranslation();
  return (
    <>
      <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
        <Typography variant="h1" sx={{ m: '0 0 1.25em' }}>
          {translation.myActions}
        </Typography>
        <UserActions  
          databaseUser={user}
        />
      </Box>
   </>
  );
};

export default Actions;
