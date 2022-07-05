import { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import { updateLoginState } from '../../actions/loginActions';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ Component, user }) => {
  const [isLoggedIn, setIsLoggedIn] = useState();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        await Auth.currentAuthenticatedUser();
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, []);

  return isLoggedIn ? (
    user ? (
      <Component user={user} />
    ) : (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <CircularProgress />
      </Box>
    )
  ) : (
    updateLoginState('signIn')
  );
};

export default PrivateRoute;
