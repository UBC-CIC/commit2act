import * as React from 'react';
import { screen } from '@testing-library/react';
import { renderWithAppContext } from '../utils/jest-mock-utils';
import ValidateActions from './ValidateActions';

jest.mock('aws-amplify', () => ({
  API: {
    graphql: () => ({
      data: {
        getAllSubmittedActionsToValidate: [],
        getAllSubmittedActionsOfUsersWithoutGroupToValidateForAdmin: [],
        getAllSubmittedActionsToValidateForAdmin: [],
      },
    }),
  },
}));

describe('ValidateActions', () => {
  it('renders heading without tabs when user is not admin', async () => {
    renderWithAppContext(<ValidateActions />);

    const heading = await screen.findByRole('heading', {
      level: 1,
      name: /validate actions/i,
    });

    expect(heading).toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  it('renders heading and tabs with My Groups selected when user is admin', async () => {
    renderWithAppContext(<ValidateActions />, {}, true);

    const heading = await screen.findByRole('heading', {
      level: 1,
      name: /validate actions/i,
    });
    const tabs = await screen.findAllByRole('tab');

    expect(heading).toBeInTheDocument();
    expect(tabs.length).toBe(3);
    expect(tabs[0]).toHaveTextContent(/my groups/i);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });
});
