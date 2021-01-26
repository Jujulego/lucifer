import React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EditPasswordField from './EditPasswordField';

// Tests
describe('EditPasswordField: editable mode', () => {
  it('should change input type on button click', () => {
    // Render
    render(
      <EditPasswordField
        editable onChangeEditable={() => null}
        value="password"
      />
    );

    // Get elements
    const button = screen.getByRole('button');
    const input = screen.getByDisplayValue('password');

    // Begin with type password
    expect(input).toHaveAttribute('type', 'password');

    // 1st click => change to text
    userEvent.click(button);
    expect(input).toHaveAttribute('type', 'text');

    // 2nd click => back to password
    userEvent.click(button);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('should be required', () => {
    // Render
    render(
      <EditPasswordField
        editable onChangeEditable={() => null}
        required value="password"
      />
    );

    // Check input
    const input = screen.getByDisplayValue('password');
    expect(input).toBeRequired();
  });

  it('should be disabled', () => {
    // Render
    render(
      <EditPasswordField
        editable onChangeEditable={() => null}
        disabled value="password"
      />
    );

    // Check input
    const input = screen.getByDisplayValue('password');
    expect(input).toBeDisabled();
  });
});

describe('EditPasswordField: not-editable mode', () => {
  it('should switch to editable mode on button click', async () => {
    const spy = jest.fn();

    // Render
    const { rerender } = render(
      <EditPasswordField
        editable={false} onChangeEditable={spy}
        value=""
      />
    );

    // Interact with button
    const button = screen.getByRole('button');

    userEvent.click(button);
    expect(spy).toBeCalledWith(true);

    // Input should be focused
    rerender(
      <EditPasswordField
        editable={true} onChangeEditable={spy}
        value=""
      />
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('')).toHaveFocus();
    });
  });

  it('should not be required', () => {
    // Render
    render(<EditPasswordField required />);

    // Check input
    const input = screen.getByDisplayValue('');
    expect(input).not.toBeRequired();
  });

  it('should be disabled', () => {
    // Render
    render(<EditPasswordField disabled={false} />);

    // Check elements
    const button = screen.getByRole('button');
    const input = screen.getByDisplayValue('');

    expect(button).toBeEnabled();
    expect(input).toBeDisabled();
  });

  it('should disable button', () => {
    // Render
    render(<EditPasswordField disabled />);

    // Check input
    const button = screen.getByRole('button');
    const input = screen.getByDisplayValue('');

    expect(button).toBeDisabled();
    expect(input).toBeDisabled();
  });
});
