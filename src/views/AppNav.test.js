import * as React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { AppNav } from './AppNav';
import { MemoryRouter } from 'react-router-dom';

var mockHandleMenuNavItem = jest.fn();

describe('AppNav', () => {
  it('passes basic a11y validation', async () => {
    const { container } = render(
      <MemoryRouter>
        <AppNav handleMenuNavItem={mockHandleMenuNavItem} />
      </MemoryRouter>
    );
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
