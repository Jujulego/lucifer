import React from 'react';

import { createShallow } from '@material-ui/core/test-utils';
import { Check as CheckIcon } from '@material-ui/icons';

import LabelledText from '../components/LabelledText';

// Setup
let shallow: ReturnType<typeof createShallow>;

beforeAll(() => {
  shallow = createShallow();
});

// Tests
it('should render correctly', () => {
  // Render
  const wrapper = shallow(
    <LabelledText label="label">Content</LabelledText>
  );

  // Checks
  expect(wrapper).toMatchSnapshot();
});

it('should render with adornment', () => {
  // Render
  const wrapper = shallow(
    <LabelledText
      label="label"
      endAdornment={<CheckIcon />}
    >
      Content
    </LabelledText>
  );

  // Checks
  expect(wrapper).toMatchSnapshot();
});
