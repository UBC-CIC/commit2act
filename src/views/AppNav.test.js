import * as React from 'react';
import { screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';
import { AppNav, mainNavItems } from './AppNav';
import { renderWithAppContext } from '../utils/jest-mock-utils';

const mainNavBaseLength = mainNavItems.length;
const mainNavNotAdminLength = mainNavBaseLength + 1;
const mainNavAdminLength = mainNavBaseLength + 2;

describe('AppNav', () => {
  it('renders links from mainNavItems plus my account link', async () => {
    const { container } = renderWithAppContext(<AppNav />, {
      wrapper: MemoryRouter,
    });

    const results = await axe(container);
    const links = await screen.findAllByRole('link');

    expect(results).toHaveNoViolations();
    expect(links.length).toEqual(mainNavNotAdminLength);
    expect(links[mainNavNotAdminLength - 1]).toHaveTextContent(/my account/i);
  });

  it('renders log action as first nav item', async () => {
    renderWithAppContext(<AppNav />, { wrapper: MemoryRouter });

    const links = await screen.findAllByRole('link');

    expect(links[0]).toHaveTextContent(/log action/i);
  });

  it('renders additional admin dashboard link when user is admin', async () => {
    const { container } = renderWithAppContext(
      <AppNav />,
      { wrapper: MemoryRouter },
      true
    );

    const results = await axe(container);
    const links = await screen.findAllByRole('link');

    expect(results).toHaveNoViolations();
    expect(links.length).toEqual(mainNavAdminLength);
    expect(links[mainNavAdminLength - 2]).toHaveTextContent(/admin dashboard/i);
    expect(links[mainNavAdminLength - 1]).toHaveTextContent(/my account/i);
  });
});
