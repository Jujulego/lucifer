import React from 'react';
import { screen, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import RefreshButton from '../lib/RefreshButton';

// Tests
describe('RefreshButton', () => {
  it('should render a button', () => {
    // Render
    render(
      <RefreshButton refreshing={false} />
    );

    // Check elements
    const btn = screen.getByRole('button');
    expect(btn).toBeEnabled();
  });

  it('should render a progress bar within a disabled button', () => {
    // Render
    render(
      <RefreshButton refreshing={true} />
    );

    // Check elements
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();

    expect(within(btn).getByRole('progressbar')).toBeInTheDocument();
  });

  it('should be disabled', () => {
    // Render
    render(
      <RefreshButton refreshing={false} disabled />
    );

    // Check elements
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
  });

  it('should react on click', () => {
    const spy = jest.fn();

    // Render
    render(
      <RefreshButton refreshing={false} onClick={spy} />
    );

    // Interact
    const btn = screen.getByRole('button');
    userEvent.click(btn);

    expect(spy).toBeCalled();
  });
});
