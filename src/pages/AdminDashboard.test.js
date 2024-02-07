import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import AdminDashboard from './AdminDashboard';

jest.mock('aws-amplify', () => ({
  API: {
    graphql: () => ({
      data: {
        getAllActions: [],
        getAllGroups: [],
        getAllSubmittedActions: [],
        getAllUsers: [],
      },
    }),
  },
}));

jest.mock('react-chartjs-2', () => ({
  Bar: (props) => <div {...props} />,
  Doughnut: (props) => <div {...props} />,
}));

describe('AdminDashboard', () => {
  it('renders menu tabs with first (dashboard) selected', async () => {
    const { container } = render(<AdminDashboard />, { wrapper: MemoryRouter });

    const tabs = await screen.findAllByRole('tab');
    const heading = await screen.findByRole('heading', {
      level: 1,
      name: /admin dashboard/i,
    });
    const results = await axe(container);

    expect(tabs.length).toBe(4);
    expect(heading).toBeInTheDocument();
    expect(results).toHaveNoViolations();
    expect(tabs[0]).toHaveTextContent(/dashboard/i);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('selecting other tabs renders expected content', async () => {
    render(<AdminDashboard />, { wrapper: MemoryRouter });

    const tabs = await screen.findAllByRole('tab');

    expect(tabs[2]).toHaveTextContent(/manage actions/i);

    userEvent.click(tabs[2]);

    const heading = await screen.findByRole('heading', {
      level: 1,
      name: /select an action to view and edit/i,
    });

    expect(heading).toBeInTheDocument();
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
  });
});
