import * as React from 'react';
import { screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { renderWithAppContext } from '../utils/jest-mock-utils';
import Actions from './Actions';

jest.mock('aws-amplify', () => ({
  API: {
    graphql: () => ({
      data: {
        getAllSubmittedActionsForUser: [],
      },
    }),
  },
}));

describe('Actions', () => {
  it('renders main heading and passes basic a11y validation', async () => {
    const { container } = renderWithAppContext(<Actions />);

    const heading = await screen.findByRole('heading', {
      level: 1,
      name: /my actions/i,
    });
    const results = await axe(container);

    expect(results).toHaveNoViolations();
    expect(heading).toBeInTheDocument();
  });

  it('renders actions tabs', async () => {
    renderWithAppContext(<Actions />);

    const tabs = await screen.findAllByRole('tab');

    expect(tabs.length).toBe(3);
    expect(tabs[0]).toHaveTextContent(/validated/i);
  });
});
