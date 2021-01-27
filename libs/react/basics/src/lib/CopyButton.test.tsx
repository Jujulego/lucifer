import React from 'react';
import copy from 'copy-to-clipboard';
import { act, screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CopyButton from '../lib/CopyButton';

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
describe('CopyButton', () => {
  it('should render a button', () => {
    // Render
    render(
      <CopyButton text="test" />
    );

    // Check elements
    expect(screen.queryByRole('button')).toBeInTheDocument();
  });

  it('should copy on click', () => {
    const spy = jest.fn();
    (copy as jest.Mock).mockImplementation(() => true);

    // Render
    render(
      <CopyButton text="test" tooltip="tooltip" onCopied={spy} />
    );

    // Interact
    const btn = screen.getByRole('button');
    userEvent.click(btn);

    // Check callbacks
    expect(spy).toBeCalled();
    expect(copy).toHaveBeenCalledWith('test', { format: 'text/plain' });

    // Check tooltip
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('tooltip');

    act(() => {
      jest.runAllTimers();
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
