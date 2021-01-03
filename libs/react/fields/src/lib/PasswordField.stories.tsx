import React, { ChangeEvent, useEffect, useState } from 'react';
import { Meta, Story } from '@storybook/react';

import PasswordField, { PasswordFieldProps } from './PasswordField';

// Config
export default {
  title: 'Fields/PasswordField',
  component: PasswordField,
  argTypes: {
    onChange: { action: 'onChange' }
  }
} as Meta

// Stories
const Template: Story<PasswordFieldProps> = (args) => {
  const { onChange } = args;

  // State
  const [value, setValue] = useState<string>("");

  // Effects
  useEffect(() => {
    setValue(args.value as string);
  }, [args.value]);

  // Callbacks
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event);
    }

    setValue(event.target.value);
  }

  return (
    <div style={{ minWidth: 200 }}>
      <PasswordField
        {...args}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

export const Primary = Template.bind({});
Primary.args = {
  label: 'Password'
};
