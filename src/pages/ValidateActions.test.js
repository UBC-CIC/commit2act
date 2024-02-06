import * as React from 'react';
import { screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { renderWithAppContext } from '../utils/jest-mock-utils';
import ValidateActions, { actionsTabKeys } from './ValidateActions';

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
  it('passes basic a11y validation', async () => {
    const { container } = renderWithAppContext(<ValidateActions />, {}, true);

    const heading = await screen.findByRole('heading', {
      level: 1,
      name: /validate actions/i,
    });
    const results = await axe(container);

    expect(heading).toBeInTheDocument();
    expect(results).toHaveNoViolations();
  });

  it('renders heading, search controls, actions messaging, and pagination', async () => {
    renderWithAppContext(<ValidateActions />);

    const heading = await screen.findByRole('heading', {
      level: 1,
      name: /validate actions/i,
    });

    expect(heading).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /group name/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /action name/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/there are no actions in need of validation/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: /pagination navigation/i })
    ).toBeInTheDocument();
  });

  it('does not render actions tabs when user is not a group admin', async () => {
    renderWithAppContext(<ValidateActions />);

    const heading = await screen.findByRole('heading', {
      level: 1,
      name: /validate actions/i,
    });

    expect(heading).toBeInTheDocument();
    expect(screen.queryAllByRole('tab').length).toBe(0);
  });

  it('renders actions tabs with My Groups selected when user is admin', async () => {
    renderWithAppContext(<ValidateActions />, {}, true);

    const heading = await screen.findByRole('heading', {
      level: 1,
      name: /validate actions/i,
    });
    const tabs = await screen.findAllByRole('tab');

    expect(heading).toBeInTheDocument();
    expect(tabs.length).toBe(actionsTabKeys.length);
    expect(tabs[0]).toHaveTextContent(/my groups/i);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });
});
