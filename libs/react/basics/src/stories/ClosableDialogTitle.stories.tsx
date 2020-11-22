import React from 'react';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';

import ClosableDialogTitle from '../lib/ClosableDialogTitle';

// Stories
export default {
  title: 'Basics/ClosableDialogTitle',
  component: ClosableDialogTitle
}

export const story = () => (
  <div style={{ minWidth: 300 }}>
    <ClosableDialogTitle
      onClose={action('close')}
    >
      { text('title', 'Title') }
    </ClosableDialogTitle>
  </div>
)
