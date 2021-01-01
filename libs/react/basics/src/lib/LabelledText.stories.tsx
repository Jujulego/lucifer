import React, { PropsWithChildren } from 'react';
import { Meta, Story } from '@storybook/react';

import { Check as CheckIcon } from '@material-ui/icons';

import LabelledText, { LabelledTextProps } from '../lib/LabelledText';

// Config
export default {
  title: 'Basics/LabelledText',
  component: LabelledText,
  argTypes: {
    endAdornment: {
      control: { type: null }
    }
  }
} as Meta;

// Stories
const Template: Story<PropsWithChildren<LabelledTextProps>> = (args) => (
  <LabelledText {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  label: 'Label',
  children: 'Content',
};

export const WithAdornment = Template.bind({});
WithAdornment.args = {
  label: 'Label',
  children: 'Content',
  endAdornment: <CheckIcon />
};
