import React from 'react';
import copy from 'copy-to-clipboard';
import { act } from 'react-dom/test-utils';
import { createShallow, createMount } from '@material-ui/core/test-utils';

import CopyButton from '../lib/CopyButton';

// Mocks
jest.mock('copy-to-clipboard');

// Setup
let mount: ReturnType<typeof createMount>;
let shallow: ReturnType<typeof createShallow>;

beforeAll(() => {
  jest.useFakeTimers();

  mount = createMount();
  shallow = createShallow();
});

afterAll(() => {
  jest.restoreAllMocks();

  mount.cleanUp();
});

beforeEach(() => {
  (copy as jest.Mock).mockReset();
});

// Tests
it('should render correctly', () => {
  // Render
  const wrapper = shallow(
    <CopyButton text={'test'} />
  );

  // Check elements
  expect(wrapper).toMatchSnapshot();
});

it('should copy on click', () => {
  const spy = jest.fn();
  (copy as jest.Mock).mockImplementation(() => true);

  // Render
  const wrapper = mount(
    <CopyButton
      text='test' format='text/plain'
      onCopied={spy}
    />
  );

  // Get button
  const button = wrapper.find('button');
  expect(button).toHaveLength(1);

  // Test event
  act(() => {
    button.simulate('click');
    jest.runAllTimers();
  });

  expect(copy).toHaveBeenCalledTimes(1);
  expect(copy).toHaveBeenCalledWith('test', { format: 'text/plain' });

  expect(spy).toHaveBeenCalledTimes(1);
});
