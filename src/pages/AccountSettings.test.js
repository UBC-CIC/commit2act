import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { UserInfoContext } from '../hooks/use-user-info-context';
import { mockUser } from '../utils/jest-mock-utils';
import AccountSettings from './AccountSettings';

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

const AccountSettingsWithProviders = (props) => (
  <UserInfoContext.Provider value={{ user: mockUser, setUser: jest.fn() }}>
    <AccountSettings {...props} />
  </UserInfoContext.Provider>
);

describe('AccountSettings', () => {
  it('renders main heading with user avatar, name, and email', async () => {
    const { container } = render(<AccountSettingsWithProviders />);

    // We're using the promise-based `findBy` util here because of the post-init async changes
    // caused by API requests, hooks, and other dependencies within the component's children.
    // This is all to avoid the dreaded `act` error in React tests:
    // https://davidwcai.medium.com/react-testing-library-and-the-not-wrapped-in-act-errors-491a5629193b

    const heading = await screen.findByRole('heading', {
      level: 1,
      name: /my account/i,
    });
    const results = await axe(container);

    expect(results).toHaveNoViolations();
    expect(heading).toBeInTheDocument();
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByRole('img').getAttribute('src')).toContain(
      mockUser.avatar
    );
  });

  it('renders edit info button which opens edit modal', async () => {
    render(<AccountSettingsWithProviders />);

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
    render(<AccountSettingsWithProviders />);

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
