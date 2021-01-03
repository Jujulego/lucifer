import React, { ChangeEvent, useEffect, useState } from 'react';
import { Meta, Story } from '@storybook/react';

import EditPasswordField, { EditPasswordFieldProps } from './EditPasswordField';

// Config
export default {
  title: 'Fields/EditPasswordField',
  component: EditPasswordField,
  argTypes: {
    onChange: { action: 'onChange' },
    onChangeEditable: { action: 'onChangeEditable' }
  }
} as Meta;

// Stories
const Template: Story<EditPasswordFieldProps> = (args) => {
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

  // Render
  return (
    <div style={{ minWidth: 200 }}>
      <EditPasswordField
        {...args}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export const Editable = Template.bind({});
Editable.args = {
  label: 'Password',
  editable: true,
  value: 'Password'
}

export const NotEditable = Template.bind({});
NotEditable.args = {
  label: 'Password',
  editable: false,
  value: 'Password'
}
