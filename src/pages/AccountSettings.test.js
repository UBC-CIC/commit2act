import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccountSettings from './AccountSettings';
import { mockUser } from '../utils/jest-mock-utils';

jest.mock('aws-amplify', () => ({
  API: {
    graphql: () => ({
      data: {
        getAllSubmittedActionsForUser: [],
        getSingleUser: {},
      },
    }),
  },
}));

jest.mock('../hooks/use-user-info-context', () => ({
  useUserInfoContext: () => ({
    user: mockUser,
    setUser: jest.fn(),
  }),
}));

describe('AccountSettings', () => {
  it('renders main heading with user avatar, name, and email', async () => {
    render(<AccountSettings />);

    // We're using the promise-based `findBy` util here because of the post-init async changes
    // caused by API requests, hooks, and other dependencies within the component's children.
    // This is all to avoid the dreaded `act` error in React tests:
    // https://davidwcai.medium.com/react-testing-library-and-the-not-wrapped-in-act-errors-491a5629193b

    const heading = await screen.findByRole('heading', {
      level: 1,
      name: /my account/i,
    });
    expect(heading).toBeInTheDocument();
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByRole('img').getAttribute('src')).toContain(
      mockUser.avatar
    );
  });

  it('renders edit info button which opens edit modal', async () => {
    render(<AccountSettings />);

    const button = await screen.findByRole('button', { name: /edit info/i });
    expect(button).toBeInTheDocument();

    userEvent.click(button);

    const dialog = await screen.findByRole('dialog');
    const heading = await screen.findByRole('heading', {
      level: 2,
      name: /edit account information/i,
    });
    expect(dialog).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
  });

  it('renders actions heading and tabs', async () => {
    render(<AccountSettings />);

    const tabs = await screen.findAllByRole('tab');
    const heading = await screen.findByRole('heading', {
      level: 2,
      name: /my actions/i,
    });
    expect(heading).toBeInTheDocument();
    expect(tabs.length).toBe(3);
    expect(tabs[0]).toHaveTextContent(/validated/i);
  });
});
