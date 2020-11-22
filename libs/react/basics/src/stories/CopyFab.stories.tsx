import React from 'react';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';

import CopyFab from '../lib/CopyFab';

// Stories
export default {
  title: 'Basics/CopyFab',
  component: CopyFab
}

export const story = () => (
  <CopyFab
    text={text('text', 'Lorem ipsum dolor sit amet ...')}
    format={text('format', 'text/plain')}
    onCopied={action('copied')}
  />
);
