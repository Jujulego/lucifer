import React from 'react';
import { action } from '@storybook/addon-actions';
import { number, text } from '@storybook/addon-knobs';

import CopyButton from '../lib/CopyButton';

// Stories
export default {
  title: 'Basics/CopyButton',
  component: CopyButton
}

export const story = () => (
  <CopyButton
    text={text('text', 'Lorem ipsum dolor sit amet ...')}
    format={text('format', 'text/plain')}
    tooltip={text('tooltip', 'Copié !')}
    tooltipTimeout={number('tooltipTimeout', 1500)}
    onCopied={action('copied')}
  />
);
