import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';
import { UserInfoContext } from '../hooks/use-user-info-context';
import { AppNav, mainNavItems } from './AppNav';

const mockHandleMenuNavItem = jest.fn();

const AppNavWithProviders = ({ userIsAdmin = false, ...props }) => (
  <MemoryRouter>
    <UserInfoContext.Provider value={{ userIsAdmin }}>
      <AppNav handleMenuNavItem={mockHandleMenuNavItem} {...props} />
    </UserInfoContext.Provider>
  </MemoryRouter>
);

const mainNavBaseLength = mainNavItems.length;
const mainNavNotAdminLength = mainNavBaseLength + 1;
const mainNavAdminLength = mainNavBaseLength + 2;

describe('AppNav', () => {
  it('renders links from mainNavItems plus my account link', async () => {
    const { container } = render(<AppNavWithProviders />);

    const results = await axe(container);
    const links = await screen.findAllByRole('link');

    expect(results).toHaveNoViolations();
    expect(links.length).toEqual(mainNavNotAdminLength);
    expect(links[mainNavNotAdminLength - 1]).toHaveTextContent(/my account/i);
  });

  it('renders log action as first nav item', async () => {
    render(<AppNavWithProviders />);

    const links = await screen.findAllByRole('link');

    expect(links[0]).toHaveTextContent(/log action/i);
  });

  it('renders additional admin dashboard link when user is admin', async () => {
    const { container } = render(<AppNavWithProviders userIsAdmin={true} />);

    const results = await axe(container);
    const links = await screen.findAllByRole('link');

    expect(results).toHaveNoViolations();
    expect(links.length).toEqual(mainNavAdminLength);
    expect(links[mainNavAdminLength - 2]).toHaveTextContent(/admin dashboard/i);
    expect(links[mainNavAdminLength - 1]).toHaveTextContent(/my account/i);
  });
});
