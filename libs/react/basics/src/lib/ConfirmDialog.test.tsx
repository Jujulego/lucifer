import React, { FC, useEffect } from 'react';
import { screen, render, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ConfirmDialog from './ConfirmDialog';
import { useConfirm } from './confirm.hooks';

// Tests
describe('ConfirmDialog', () => {
  it('should be closed and empty', () => {
    const TestComponent = () => {
      const { state } = useConfirm("");

      return (
        <ConfirmDialog state={state}>
          {(txt) => txt}
        </ConfirmDialog>
      )
    };

    // Render
    render(<TestComponent />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should be opened with content', () => {
    const TestComponent = () => {
      const { state, confirm } = useConfirm("");
      if (!state.open) confirm("Test");

      return (
        <ConfirmDialog state={state}>
          {(txt) => (
            <div data-testid="dialog-content">{ txt }</div>
          )}
        </ConfirmDialog>
      )
    };

    // Render
    render(<TestComponent />);

    // Check dialog exists
    const dialog = screen.getByRole('dialog');
    const content = within(dialog).getByTestId('dialog-content');

    expect(content).toHaveTextContent('Test');

    // Check buttons
    const buttons = within(dialog).getAllByRole('button');

    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('Annuler');
    expect(buttons[1]).toHaveTextContent('Confirmer');
  });
});

describe('useConfirm().confirm', () => {
  // Setup
  let spy: jest.Mock<void,[boolean]>;
  let TestComponent: FC;

  beforeEach(() => {
    // Utils
    spy = jest.fn();

    // Component
    TestComponent = () => {
      const { state, confirm } = useConfirm("");

      useEffect(() => {
        confirm("Test")
          .then(spy);
      }, [confirm]);

      return (
        <ConfirmDialog state={state}>
          { (txt) => txt }
        </ConfirmDialog>
      )
    };

    // Render
    render(<TestComponent />);
  });

  // Tests
  it('should return false if canceled', async () => {
    // Act event
    const btn = screen.getByText('Annuler');
    userEvent.click(btn);

    await waitFor(() => {
      expect(spy).toBeCalledWith(false);
    });
  });

  it('should return true if confirmed', async () => {
    // Act event
    const btn = screen.getByText('Confirmer');
    userEvent.click(btn);

    await waitFor(() => {
      expect(spy).toBeCalledWith(true);
    });
  });
});
