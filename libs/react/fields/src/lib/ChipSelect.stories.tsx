import React, { ChangeEvent, ReactNode, useEffect, useState } from 'react';
import { Meta, Story } from '@storybook/react';

import ChipSelect, { ChipSelectProps } from './ChipSelect';

// Config
export default {
  title: 'Fields/ChipSelect',
  component: ChipSelect,
  argTypes: {
    onChange: { action: 'changed' }
  }
} as Meta;

// Stories
const Template: Story<ChipSelectProps> = (args) => {
  const { onChange } = args;

  // State
  const [value, setValue] = useState<string[]>([]);

  // Effects
  useEffect(() => {
    setValue(args.value || []);
  }, [args.value]);

  // Callbacks
  const handleChange = (event: ChangeEvent<{ value: unknown }>, child: ReactNode) => {
    if (onChange) {
      onChange(event, child);
    }

    setValue(event.target.value as string[]);
  };

  // Render
  return (
    <ChipSelect {...args} value={value} onChange={handleChange} />
  );
};

export const WithSmallChips = Template.bind({});
WithSmallChips.args = {
  fullWidth: true,
  label: 'Label',
  helperText: 'Helper Text',
  ChipProps: { size: 'small' },
  value: [],
  options: ['Option #1', 'Option #2', 'Option #3']
};
