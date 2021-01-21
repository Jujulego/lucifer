import React from 'react';
import { act } from 'react-dom/test-utils';
import { createMount, createShallow } from '@material-ui/core/test-utils';

import RefreshButton from '../lib/RefreshButton';

// Setup
let mount: ReturnType<typeof createMount>;
let shallow: ReturnType<typeof createShallow>;

beforeAll(() => {
  mount = createMount();
  shallow = createShallow();
});

// Tests
it('should render correctly (refreshing)', () => {
  // Render
  const wrapper = shallow(
    <RefreshButton refreshing={true} />
  );

  // Check elements
  expect(wrapper).toMatchSnapshot();
});

it('should render correctly (not refreshing)', () => {
  // Render
  const wrapper = shallow(
    <RefreshButton refreshing={false} />
  );

  // Check elements
  expect(wrapper).toMatchSnapshot();
});

it('should react on click', () => {
  const spy = jest.fn();

  // Render
  const wrapper = mount(
    <RefreshButton refreshing={false} onClick={spy} />
  );

  // Get button
  const button = wrapper.find('button');
  expect(button).toHaveLength(1);

  // Test event
  act(() => {
    button.simulate('click');
  });

  expect(spy).toBeCalled();
});
