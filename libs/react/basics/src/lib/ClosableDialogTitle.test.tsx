import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ClosableDialogTitle from './ClosableDialogTitle';

// Tests
describe('ClosableDialogTitle', () => {
  it('should render title', () => {
    // Render
    render(
      <ClosableDialogTitle>
        Title
      </ClosableDialogTitle>
    );

    // Check elements
    const title = screen.getByRole('heading');
    expect(title).toHaveTextContent('Title');
  });

  it('should close on button click', () => {
    const spy = jest.fn();

    // Render
    render(
      <ClosableDialogTitle onClose={spy}>
        Title
      </ClosableDialogTitle>
    );

    // Interact
    const button = screen.getByRole('button');

    userEvent.click(button);
    expect(spy).toBeCalled();
  });
});
