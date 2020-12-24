import React, { PropsWithChildren } from 'react';
import { Meta, Story } from '@storybook/react';

import ClosableDialogTitle, { ClosableDialogTitleProps } from './ClosableDialogTitle';

// Config
export default {
  title: 'Basics/ClosableDialogTitle',
  component: ClosableDialogTitle,
  argTypes: {
    onClose: { action: 'closed' }
  }
} as Meta;

// Stories
const Template: Story<PropsWithChildren<ClosableDialogTitleProps>> = (args) => (
  <ClosableDialogTitle {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  children: 'Title'
};
