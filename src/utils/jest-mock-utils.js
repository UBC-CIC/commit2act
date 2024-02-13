import * as React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { UserInfoContext } from '../hooks/use-user-info-context';
import theme from '../themes';

export const mockUser = {
  user_id: 123,
  name: 'Jest Tester',
  email: 'jest-tester@email.com',
  avatar: 'https://avatar.com/jest-tester.png',
  total_co2: 238497994.31410018,
  total_points: 238497997,
  weekly_co2: 5040,
  weekly_points: 238497997,
  username: 'jesttester',
};

export const mockUserValues = {
  user: mockUser,
  userIsAdmin: false,
  userType: 'Member',
  setUser: jest.fn(),
};

export const mockAdminUserValues = {
  user: mockUser,
  userIsAdmin: true,
  userType: 'Admin',
  setUser: jest.fn(),
};

export const renderWithAppContext = (
  component,
  renderOptions = {},
  isAdmin = false
) =>
  render(
    <ThemeProvider theme={theme}>
      <UserInfoContext.Provider
        value={isAdmin ? mockAdminUserValues : mockUserValues}
      >
        {component}
      </UserInfoContext.Provider>
    </ThemeProvider>,
    renderOptions
  );
