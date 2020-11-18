import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';

import ToolbarAction from './ToolbarAction';

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
    <ToolbarAction tooltip="Test" />
  );

  // Check elements
  expect(wrapper).toMatchSnapshot();
});

it('should react on click', () => {
  const spy = jest.fn();

  // Render
  const wrapper = mount(
    <ToolbarAction tooltip="Test" onClick={spy} />
  );

  // Get button
  const button = wrapper.find('button');
  expect(button).toHaveLength(1);

  // Test event
  button.simulate('click');

  expect(spy).toBeCalledTimes(1);
});

it('should have no tooltip when disabled', () => {
  // Render
  const wrapper = shallow(
    <ToolbarAction tooltip="Test" disabled />
  );

  // Check elements
  expect(wrapper).toMatchSnapshot();
});

it('should not react when disabled', () => {
  const spy = jest.fn();

  // Render
  const wrapper = mount(
    <ToolbarAction tooltip="Test" onClick={spy} disabled />
  );

  // Get button
  const button = wrapper.find('button');
  expect(button).toHaveLength(1);
  expect(button.prop('disabled')).toBeTruthy();

  // Test event
  button.simulate('click');
  expect(spy).not.toBeCalled();
});
