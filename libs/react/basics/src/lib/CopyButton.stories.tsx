import React from 'react';
import { Meta, Story } from '@storybook/react';

import CopyButton, { CopyButtonProps } from './CopyButton';

// Config
export default {
  title: 'Basics/CopyButton',
  component: CopyButton,
  argTypes: {
    onCopied: { action: 'copied' }
  }
} as Meta;

// Stories
const Template: Story<CopyButtonProps> = (args) => (
  <CopyButton {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  text: 'Lorem ipsum dolor sit amet ...',
  format: 'text/plain',
  tooltip: 'Copié !',
  tooltipTimeout: 1500,
};
