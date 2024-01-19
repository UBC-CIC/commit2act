import * as React from 'react';
import { render, screen } from '@testing-library/react';
import {
  MockReduxStoreProvider,
  mockAuthReduxStore,
} from './utils/mock-redux-store-provider';
import { Box } from '@mui/material';
import App from './App';

// Mock window object native functions
global.scrollTo = jest.fn();

const MockLogin = (props) => <Box {...props} data-testid="login" />;
const MockPageContainer = (props) => (
  <Box {...props} data-testid="page-container" />
);

jest.mock('./components/authentication/Login_material', () => (props) => (
  <MockLogin {...props} />
));

jest.mock('./views/pageContainer/PageContainer', () => (props) => (
  <MockPageContainer {...props} />
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
  it('renders Login when user is not authenticated', () => {
    render(<App />, { wrapper: MockReduxStoreProvider });
    expect(screen.getByTestId('login')).toBeInTheDocument();
  });

  it('renders PageContainer when user is authenticated', () => {
    render(<App />, {
      wrapper: (props) => (
        <MockReduxStoreProvider {...props} store={mockAuthReduxStore} />
      ),
    });
    expect(screen.getByTestId('page-container')).toBeInTheDocument();
  });
});
