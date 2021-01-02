import React, { ChangeEvent, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';

import PasswordField from './PasswordField';

// Stories
export default {
  title: 'Basics/Fields/PasswordField',
  component: PasswordField
}

export function Story() {
  const [value, setValue] = useState<string[]>([]);

  const handleChange = (event: ChangeEvent<{ value: unknown }>, ...args: any[]) => {
    action('change')(event, ...args);
    setValue(event.target.value as string[]);
  }

  return (
    <div style={{ minWidth: 200 }}>
      <PasswordField
        label={text('label', 'Password')}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
