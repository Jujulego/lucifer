import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';

import ChipSelect from '../../components/Fields/ChipSelect';

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
    <ChipSelect
      label="Test" helperText="Lorem ipsum dolor"
      value={['Test #2']} options={['Test #1', 'Test #2', 'Test #3']}
      onChange={() => {}}
    />
  );

  // Check elements
  expect(wrapper).toMatchSnapshot();
});

it('should change on option click', () => {
  const spy = jest.fn();

  // Render
  const wrapper = mount(
    <ChipSelect
      label="Test" helperText="Lorem ipsum dolor"
      SelectProps={{ open: true }}
      value={['Test #2']} options={['Test #1', 'Test #2', 'Test #3']}
      onChange={spy}
    />
  );

  // Get first option
  const option = wrapper.find('ul > *:first-child li');
  expect(option).toHaveLength(1);

  // Test event
  option.simulate('click');

  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith(
    expect.objectContaining({
      target: expect.objectContaining({
        value: ['Test #2', 'Test #1']
      })
    }),
    expect.anything()
  )
});
