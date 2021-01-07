import React from 'react';
import dayjs from 'dayjs';
import { Meta, Story } from '@storybook/react';

import RelativeDate, { RelativeDateProps } from '../lib/RelativeDate';

// Config
export default {
  title: 'Basics/RelativeDate',
  component: RelativeDate,
  argTypes: {
    date: {
      control: { type: 'date' }
    }
  }
} as Meta;

// Stories
const Template: Story<RelativeDateProps> = (args) => (
  <RelativeDate {...args} />
);

export const FromNow = Template.bind({});
FromNow.args = {
  mode: 'from',
  date: dayjs()["add"](1, 'day').toISOString(),
  withoutPrefix: false
}

export const ToNow = Template.bind({});
ToNow.args = {
  mode: 'to',
  date: dayjs()["add"](1, 'day').toISOString(),
  withoutPrefix: false
}
