import React, { FC } from 'react';

import {
  DialogTitle as MuiDialogTitle,
  IconButton, Typography
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

import { StyledProps } from '@lucifer/react/utils';

// Types
export type ClosableDialogTitleClassKey = 'root' | 'title' | 'closeButton';
export interface ClosableDialogTitleProps extends StyledProps<ClosableDialogTitleClassKey> {
  /** Close callback */
  onClose?: () => void;
}

// Styles
const useStyles = makeStyles<Theme, ClosableDialogTitleProps, ClosableDialogTitleClassKey>({
  root: {
    display: 'flex',
  },
  title: {
    flexGrow: 1,
  },
  closeButton: {
    marginTop: -8,
    marginBottom: -8,
  },
});

// Component
const ClosableDialogTitle: FC<ClosableDialogTitleProps> = (props) => {
  // Props
  const { children, onClose } = props;

  // Render
  const styles = useStyles(props);

  return (
    <MuiDialogTitle classes={{ root: styles.root }} disableTypography>
      <Typography
        classes={{ root: styles.title }}
        component="h2" variant="h6"
      >
        { children }
      </Typography>
      <IconButton classes={{ root: styles.closeButton }} edge="end" onClick={onClose} aria-label="close dialog">
        <CloseIcon />
      </IconButton>
    </MuiDialogTitle>
  );
};

export default ClosableDialogTitle;
