import React from 'react';
import dayjs from 'dayjs';
import { render } from '@testing-library/react';
import { useInterval } from '@lucifer/react-utils';

import RelativeDate from '../lib/RelativeDate';

// Mocks
jest.mock('@lucifer/react-utils');

// Setup
beforeEach(() => {
  (useInterval as jest.Mock)
    .mockImplementation(() => 1)
    .mockReset();
});

// Tests
describe('RelativeDate', () => {
  it('should re-render every minutes', () => {
    // Render
    render(
      <RelativeDate date={dayjs()} mode='to' />
    );

    // Checks
    expect(useInterval).toHaveBeenCalledWith(1, expect.stringMatching(/minutes?/))
  });

  describe('to mode', () => {
    it('should render correctly', () => {
      // Render
      const { container } = render(
        <RelativeDate date={dayjs().add(1, 'day')} mode='to' />
      );

      // Checks
      expect(container).toHaveTextContent('a day ago');
    });

    it('should render without prefix', () => {
      // Render
      const { container } = render(
        <RelativeDate date={dayjs().add(1, 'day')} mode='to' withoutPrefix />
      );

      // Checks
      expect(container).toHaveTextContent('a day');
    });
  });

  describe('from mode', () => {
    it('should render correctly', () => {
      // Render
      const { container } = render(
        <RelativeDate date={dayjs().add(1, 'day')} mode='from' />
      );

      // Checks
      expect(container).toHaveTextContent('in a day');
    });

    it('should render without prefix', () => {
      // Render
      const { container } = render(
        <RelativeDate date={dayjs().add(1, 'day')} mode='from' withoutPrefix />
      );

      // Checks
      expect(container).toHaveTextContent('a day');
    });
  });
});
