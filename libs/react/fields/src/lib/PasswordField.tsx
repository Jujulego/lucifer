import React, { useState } from 'react';

import {
  IconButton,
  InputAdornment,
  TextField, StandardTextFieldProps, FilledTextFieldProps, OutlinedTextFieldProps, TextFieldProps
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

// Types
type TextToPassword<T extends TextFieldProps> =
  Omit<T, 'type' | 'InputProps' | 'select' | 'SelectProps'> &
  {
    InputProps?: Omit<T['InputProps'], 'endAdornment'>
  }

export type FilledPasswordFieldProps   = TextToPassword<FilledTextFieldProps>;
export type OutlinedPasswordFieldProps = TextToPassword<OutlinedTextFieldProps>;
export type StandardPasswordFieldProps = TextToPassword<StandardTextFieldProps>;

export type PasswordFieldProps =
  FilledPasswordFieldProps       |
  OutlinedPasswordFieldProps     |
  StandardPasswordFieldProps;

// Component
const PasswordField = (props: PasswordFieldProps) => {
  // Props
  const { InputProps = {}, ...field } = props;

  // State
  const [visible, setVisible] = useState(false);

  // Render
  const endAdornment = (
    <InputAdornment position="end">
      <IconButton onClick={() => setVisible(!visible)}>
        { visible ? <VisibilityOff /> : <Visibility /> }
      </IconButton>
    </InputAdornment>
  );

  return (
    <TextField
      {...field}
      type={visible ? 'text' : 'password'}
      InputProps={{ ...InputProps, endAdornment }}
    />
  );
};

export default PasswordField;