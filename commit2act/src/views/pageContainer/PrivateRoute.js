import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { updateLoginState } from '../../actions/loginActions';

const PrivateRoute = ({ children }) => {
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

  return isLoggedIn ? children : updateLoginState('signIn');
};

export default PrivateRoute;
