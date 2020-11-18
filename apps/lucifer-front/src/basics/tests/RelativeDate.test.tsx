import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import moment from 'moment';

import useInterval from '../../utils/hooks/useInterval';

import RelativeDate from '../components/RelativeDate';

// Mocks
jest.mock('utils/hooks/useInterval');

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
      <RelativeDate date={moment().add('1', 'day')} mode='to' />
    );

    // Checks
    expect(wrapper.text()).toBe('il y a un jour');
  });

  it('should render without prefix', () => {
    // Render
    const wrapper = shallow(
      <RelativeDate date={moment().add('1', 'day')} mode='to' withoutPrefix />
    );

    // Checks
    expect(wrapper.text()).toBe('un jour');
  });
});

describe('from mode', () => {
  it('should render correctly', () => {
    // Render
    const wrapper = shallow(
      <RelativeDate date={moment().add('1', 'day')} mode='from' />
    );

    // Checks
    expect(wrapper.text()).toBe('dans un jour');
  });

  it('should render without prefix', () => {
    // Render
    const wrapper = shallow(
      <RelativeDate date={moment().add('1', 'day')} mode='from' withoutPrefix />
    );

    // Checks
    expect(wrapper.text()).toBe('un jour');
  });
});

it('should re-render every minutes', () => {
  // Render
  shallow(
    <RelativeDate date={moment()} mode='to' />
  );

  // Checks
  expect(useInterval).toHaveBeenCalledWith(1, expect.stringMatching(/minutes?/))
});
