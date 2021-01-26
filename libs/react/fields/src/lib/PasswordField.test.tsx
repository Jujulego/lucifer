import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PasswordField from './PasswordField';

// Test suites
describe('PasswordField', () => {
  it('should change input type on button click', async () => {
    // Render
    render(<PasswordField value="password" />);

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
});
