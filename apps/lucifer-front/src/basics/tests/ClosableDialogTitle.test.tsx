import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';

import ClosableDialogTitle from '../components/ClosableDialogTitle';

// Setup
let mount: ReturnType<typeof createMount>;
let shallow: ReturnType<typeof createShallow>;

beforeAll(() => {
  mount = createMount();
  shallow = createShallow();
});

afterAll(() => {
  mount.cleanUp();
});

// Tests
it('should render correctly', () => {
  // Render
  const wrapper = shallow(
    <ClosableDialogTitle>
      Title
    </ClosableDialogTitle>
  );

  // Check elements
  expect(wrapper).toMatchSnapshot();
});

it('should react to button click', () => {
  const spy = jest.fn();

  // Render
  const wrapper = mount(
    <ClosableDialogTitle onClose={spy}>
      Title
    </ClosableDialogTitle>
  );

  // Get button
  const button = wrapper.find('button');
  expect(button).toHaveLength(1);

  // Test event
  button.simulate('click');

  expect(spy).toHaveBeenCalledTimes(1);
});
