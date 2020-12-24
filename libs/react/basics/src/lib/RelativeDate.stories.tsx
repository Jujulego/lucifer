import React from 'react';
import moment from 'moment';
import { boolean, date } from '@storybook/addon-knobs';

import RelativeDate from '../lib/RelativeDate';

// Stories
export default {
  title: 'Basics/RelativeDate',
  component: RelativeDate
}

export const FromNow = () => (
  <RelativeDate
    mode="from"
    date={date('date', moment()["add"](1, 'day').toDate())}
    withoutPrefix={boolean('withoutPrefix', false)}
  />
);

export const ToNow = () => (
  <RelativeDate
    mode="to"
    date={date('date', moment()["add"](1, 'day').toDate())}
    withoutPrefix={boolean('withoutPrefix', false)}
  />
);
