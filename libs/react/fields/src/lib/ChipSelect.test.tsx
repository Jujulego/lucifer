import React from 'react';
import { screen, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ChipSelect from './ChipSelect';

// Tests
describe('ChipSelect', () => {
  it('should show input\'s value', () => {
    // Render
    render(
      <ChipSelect
        options={['Test #1']}
        value={['Test #1']}
      />
    );

    // Check value in button
    const values = screen.getByRole('button');
    expect(values).toHaveTextContent('Test #1');
  });

  it('should show menu options on click on values', () => {
    // Render
    render(
      <ChipSelect
        options={['Test #1']}
        value={[]}
      />
    );

    // Interact with values button
    const values = screen.getByRole('button');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    userEvent.click(values);
    expect(screen.queryByRole('listbox')).toBeInTheDocument();
  });

  it('should show options in menu', () => {
    // Render
    render(
      <ChipSelect
        SelectProps={{ open: true }}
        options={['Test #1', 'Test #2']}
      />
    );

    // Check menu's options
    const menu = screen.getByRole('listbox');
    const options = within(menu).getAllByRole('option');

    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent('Test #1');
    expect(options[1]).toHaveTextContent('Test #2');
  });

  it('should change on click on option', () => {
    const spy = jest.fn();

    // Render
    render(
      <ChipSelect
        SelectProps={{ open: true }}
        options={['Test #1', 'Test #2']}
        value={[]}
        onChange={spy}
      />
    );

    // Get an option
    const menu = screen.getByRole('listbox');
    const options = within(menu).getAllByRole('option');

    expect(options).toHaveLength(2);

    // Interact
    const option = options[0];
    userEvent.click(option);

    expect(spy).toBeCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: [option.textContent]
        })
      }),
      expect.anything()
    );
  });
});
