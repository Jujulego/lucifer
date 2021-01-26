import React from 'react';
import { screen, render, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Check as CheckIcon } from '@material-ui/icons';

import ToolbarAction from '../lib/ToolbarAction';

// Setup
beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.restoreAllMocks();
});

// Tests
describe('ToolbarAction', () => {
  it('should render a button', () => {
    // Render
    render(
      <ToolbarAction tooltip="tooltip">
        <CheckIcon data-testid="icon" />
      </ToolbarAction>
    );

    // Check elements
    const btn = screen.getByRole('button');

    expect(btn).toBeEnabled();
    expect(within(btn).queryByTestId('icon')).toBeInTheDocument();
  });

  it('should be disabled', () => {
    // Render
    render(
      <ToolbarAction tooltip="tooltip" disabled>
        <CheckIcon data-testid="icon" />
      </ToolbarAction>
    );

    // Check elements
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
  });

  it('should react on click', async () => {
    const spy = jest.fn();

    // Render
    render(
      <ToolbarAction tooltip="tooltip" onClick={spy}>
        <CheckIcon data-testid="icon" />
      </ToolbarAction>
    );

    // Interact
    const btn = screen.getByRole('button');
    userEvent.click(btn);

    // Check callback
    expect(spy).toBeCalled();

    // Check tooltip
    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveTextContent('tooltip');
    });
  });
});
