import React, { ReactNode } from 'react';
import clsx from 'clsx';

import {
  Toolbar as MuiToolbar,
  ToolbarProps as MuiToolbarProps,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { StyledProps } from 'src/utils/style';

import { useTable } from '../../table.context';

// Types
export type TableToolbarClassKey = 'root' | 'selected' | 'title';
export interface ToolbarProps extends Omit<MuiToolbarProps, 'classes'>, StyledProps<TableToolbarClassKey> {
  title: string,
  children?: ReactNode
}

// Styles
const useStyles = makeStyles(({ shape, palette, spacing }) => {
  const secondary = palette.secondary.main;
  const text = palette.getContrastText(secondary);

  return {
    root: {
      paddingRight: spacing(1)
    },
    selected: {
      color: text,
      backgroundColor: secondary,
      borderTopLeftRadius: shape.borderRadius,
      borderTopRightRadius: shape.borderRadius
    },
    title: {
      flex: '1 1 100%'
    }
  }
});

// Component
const TableToolbar = (props: ToolbarProps) => {
  // Props
  const {
    title,
    children,
    ...toolbar
  } = props;

  // Context
  const { selectedCount } = useTable();

  // Render
  const styles = useStyles(props);

  return (
    <MuiToolbar {...toolbar}
      classes={{
        root: clsx(styles.root, {
          [styles.selected]: selectedCount > 0
        })
      }}
    >
      { (selectedCount > 0) ? (
        <Typography classes={{ root: styles.title }} color="inherit" variant="subtitle1">{selectedCount} sélectionné(s)</Typography>
      ) : (
        <Typography classes={{ root: styles.title }} variant="h6">{title}</Typography>
      ) }
      { children }
    </MuiToolbar>
  );
};

export default TableToolbar;
