import React from 'react';
import { Send as SendIcon } from '@material-ui/icons';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';

import ToolbarAction from '../lib/ToolbarAction';

// Stories
export default {
  title: 'Basics/ToolbarAction',
  component: ToolbarAction
}

export const story = () => (
  <ToolbarAction
    tooltip={text('tooltip', 'Test')}
    onClick={action('click')}
  >
    <SendIcon />
  </ToolbarAction>
)
