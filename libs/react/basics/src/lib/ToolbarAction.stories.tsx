import React from 'react';
import { Meta, Story } from '@storybook/react';

import { Send as SendIcon } from '@material-ui/icons';

import ToolbarAction, { ToolbarActionProps } from '../lib/ToolbarAction';

// config
export default {
  title: 'Basics/ToolbarAction',
  component: ToolbarAction,
  argTypes: {
    onClick: { action: 'clicked' }
  }
} as Meta;

// Stories
const Template: Story<ToolbarActionProps> = (args) => (
  <ToolbarAction {...args}>
    <SendIcon />
  </ToolbarAction>
);

export const Primary = Template.bind({});
Primary.args = {
  tooltip: 'Test',
};
