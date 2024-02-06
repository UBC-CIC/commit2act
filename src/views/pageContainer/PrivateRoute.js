import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import { updateLoginState } from '../../actions/loginActions';
import { CircularProgress, Box } from '@mui/material';
import { useUserInfoContext } from '../../hooks/use-user-info-context';
import { BaseComponent } from '../../prop-types/component';

const PrivateRoute = ({ children }) => {
  const { user } = useUserInfoContext();
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

  if (!isLoggedIn) return updateLoginState('signIn');
  if (isLoggedIn && user) return <>{children}</>;

  return (
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
  );
};

PrivateRoute.propTypes = BaseComponent;

export default PrivateRoute;
