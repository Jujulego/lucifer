import React, { ChangeEvent, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';

import EditPasswordField from '../lib/EditPasswordField';

// Stories
export default {
  title: 'Basics/Fields/EditPasswordField',
  component: EditPasswordField
}

export function Story() {
  const [value, setValue] = useState<string[]>([]);

  const handleChange = (event: ChangeEvent<{ value: unknown }>, ...args: any[]) => {
    action('change')(event, ...args);
    setValue(event.target.value as string[]);
  }

  return (
    <div style={{ minWidth: 200 }}>
      <EditPasswordField
        label={text('label', 'Password')}
        value={value}
        onChange={handleChange}

        editable={boolean('editable', false)}
        onChangeEditable={action('changeEditable')}
      />
    </div>
  );
}
