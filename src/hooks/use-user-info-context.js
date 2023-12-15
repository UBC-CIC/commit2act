import { createContext, useContext } from 'react';

export const UserInfoContext = createContext({
  user: {},
  userType: '',
  userIsAdmin: false,
  setUser: () => {},
});

export const useUserInfoContext = () => {
  return useContext(UserInfoContext);
};
