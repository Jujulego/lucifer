import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import dayjs from 'dayjs';

import { useInterval } from '@lucifer/react/utils';

import RelativeDate from '../lib/RelativeDate';

// Mocks
jest.mock('@lucifer/react/utils');

// Setup
let shallow: ReturnType<typeof createShallow>;

beforeAll(() => {
  shallow = createShallow();
});

beforeEach(() => {
  (useInterval as jest.Mock)
    .mockImplementation(() => 1)
    .mockReset();
});

// Tests
describe('to mode', () => {
  it('should render correctly', () => {
    // Render
    const wrapper = shallow(
      <RelativeDate date={dayjs().add(1, 'day')} mode='to' />
    );

    // Checks
    expect(wrapper.text()).toBe('a day ago');
  });

  it('should render without prefix', () => {
    // Render
    const wrapper = shallow(
      <RelativeDate date={dayjs().add(1, 'day')} mode='to' withoutPrefix />
    );

    // Checks
    expect(wrapper.text()).toBe('a day');
  });
});

describe('from mode', () => {
  it('should render correctly', () => {
    // Render
    const wrapper = shallow(
      <RelativeDate date={dayjs().add(1, 'day')} mode='from' />
    );

    // Checks
    expect(wrapper.text()).toBe('in a day');
  });

  it('should render without prefix', () => {
    // Render
    const wrapper = shallow(
      <RelativeDate date={dayjs().add(1, 'day')} mode='from' withoutPrefix />
    );

    // Checks
    expect(wrapper.text()).toBe('a day');
  });
});

it('should re-render every minutes', () => {
  // Render
  shallow(
    <RelativeDate date={dayjs()} mode='to' />
  );

  // Checks
  expect(useInterval).toHaveBeenCalledWith(1, expect.stringMatching(/minutes?/))
});
