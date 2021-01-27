import React from 'react';
import copy from 'copy-to-clipboard';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CopyFab from '../lib/CopyFab';

// Mocks
jest.mock('copy-to-clipboard');

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  (copy as jest.Mock).mockReset();
});

// Tests
describe('CopyFab', () => {
  it('should render a button', () => {
    // Render
    render(
      <CopyFab text="test" />
    );

    // Check elements
    expect(screen.queryByRole('button')).toBeInTheDocument();
  });

  it('should copy on click', () => {
    const spy = jest.fn();
    (copy as jest.Mock).mockImplementation(() => true);

    // Render
    render(
      <CopyFab text="test" onCopied={spy} />
    );

    // Interact
    const btn = screen.getByRole('button');
    userEvent.click(btn);

    // Check callbacks
    expect(spy).toBeCalled();
    expect(copy).toHaveBeenCalledWith('test', { format: 'text/plain' });
  });
});
