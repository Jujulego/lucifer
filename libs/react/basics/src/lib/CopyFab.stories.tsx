import React from 'react';
import { Meta, Story } from '@storybook/react';

import CopyFab, { CopyFabProps } from './CopyFab';

export default {
  title: 'Basics/CopyFab',
  component: CopyFab,
  argTypes: {
    onCopied: { action: 'copied' }
  }
} as Meta;

// Stories
const Template: Story<CopyFabProps> = (args) => (
  <CopyFab {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  text: 'Lorem ipsum dolor sit amet ...',
  format: 'text/plain'
};
