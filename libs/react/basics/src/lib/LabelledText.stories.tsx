import React from 'react';
import { text } from '@storybook/addon-knobs';

import { Check as CheckIcon } from '@material-ui/icons';

import LabelledText from '../lib/LabelledText';

// Stories
export default {
  title: 'Basics/LabelledText',
  component: LabelledText
};

export const simple = () => (
  <div style={{ width: 200 }}>
    <LabelledText label={text('label', 'Label')}>
      { text('content', 'Content') }
    </LabelledText>
  </div>
);

export const with_adornment = () => (
  <div style={{ width: 200 }}>
    <LabelledText
      label={text('label', 'Label')}
      endAdornment={<CheckIcon />}
    >
      { text('content', 'Content') }
    </LabelledText>
  </div>
);
