import React from 'react';
import moment from 'moment';
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
  date: moment()["add"](1, 'day').toISOString(),
  withoutPrefix: false
}

export const ToNow = Template.bind({});
ToNow.args = {
  mode: 'to',
  date: moment()["add"](1, 'day').toISOString(),
  withoutPrefix: false
}
