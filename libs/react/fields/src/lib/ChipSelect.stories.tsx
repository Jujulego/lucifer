import React, { ChangeEvent, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';

import ChipSelect from './ChipSelect';

// Stories
export default {
  title: 'Basics/Fields/ChipSelect',
  component: ChipSelect
}

export function WithSmallChips() {
  const [value, setValue] = useState<string[]>([]);

  const handleChange = (event: ChangeEvent<{ value: unknown }>, ...args: any[]) => {
    action('change')(event, ...args);
    setValue(event.target.value as string[]);
  }

  return (
    <div style={{ minWidth: 200 }}>
      <ChipSelect
        fullWidth
        label={text('label', 'Food')}
        helperText={text('helper text', 'Your favorite')}
        ChipProps={{ size: 'small' }}
        value={value} options={['Banana', 'Carrot', 'Chocolate']}
        onChange={handleChange}
      />
    </div>
  );
}
