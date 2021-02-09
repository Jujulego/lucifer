import React from 'react';

import { IconButton, IconButtonProps } from '@material-ui/core';
import DarkIcon from '@material-ui/icons/Brightness4';
import LightIcon from '@material-ui/icons/Brightness7';

import useDarkTheme from './theme.hooks';

// Props
export type ThemeButtonProps = Omit<IconButtonProps<'button'>, 'onClick'>

// Component
const ThemeButton = (props: ThemeButtonProps) => {
  // Theme
  const { prefersDark, setPrefersDark } = useDarkTheme();

  // Render
  return (
    <IconButton {...props} onClick={() => setPrefersDark(!prefersDark)}>
      { prefersDark ? <LightIcon /> : <DarkIcon /> }
    </IconButton>
  )
};

export default ThemeButton;
