import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MockReduxStoreProvider } from './utils/mock-redux-store-provider';
import { Box } from '@mui/material';
import App from './App';

const mockSignedOutState = 'signIn';
const mockUpdateLoginState = jest.fn();

const MockLogin = (props) => <Box {...props} data-testid="login-view" />;

jest.mock('./components/authentication/Login_material', () => (props) => (
  <MockLogin {...props} />
));

jest.mock('./components/contexts/ContentTranslationsContext', () => ({
  useContentTranslationsContext: () => ({
    setContentTranslations: jest.fn(),
  }),
}));

jest.mock('./services/translations', () => ({
  getAllTranslations: () => ({}),
}));

describe('App', () => {
  it('renders Login view when user is not authenticated', () => {
    render(
      <MockReduxStoreProvider>
        <App
          loginState={mockSignedOutState}
          updateLoginState={mockUpdateLoginState}
        />
      </MockReduxStoreProvider>
    );
    expect(screen.getByTestId('login-view')).toBeInTheDocument();
  });
});
