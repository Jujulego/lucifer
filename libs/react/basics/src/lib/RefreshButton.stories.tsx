import React from 'react';
import { Meta, Story } from '@storybook/react';

import RefreshButton, { RefreshButtonProps } from '../lib/RefreshButton';

// Config
export default {
  title: 'Basics/RefreshButton',
  component: RefreshButton,
  argTypes: {
    action: { control: null },
    children: { control: null },
    onClick: { action: 'clicked' }
  }
} as Meta;

// Stories
const Template: Story<RefreshButtonProps> = (args) => (
  <RefreshButton {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  refreshing: false,
};

export const Refreshing = Template.bind({});
Refreshing.args = {
  refreshing: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};
