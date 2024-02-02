import * as React from 'react';
import { screen } from '@testing-library/react';
import { renderWithAppContext } from '../utils/jest-mock-utils';
import ValidateActions from './ValidateActions';

describe('ValidateActions', () => {
  it('renders the page heading', async () => {
    renderWithAppContext(<ValidateActions />);

    const heading = await screen.findByRole('heading', {
      level: 1,
      name: /validate actions/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
