import React, { FC } from 'react';

import { CircularProgress, Fade, IconButton, IconButtonProps } from '@material-ui/core';
import { Refresh as RefreshIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

// Styles
const useStyles = makeStyles({
  label: {
    display: 'grid',
    justifyItems: 'center',

    '& > *': {
      gridArea: '1 / 1 / 2 / 2',
    }
  }
});

// Types
export interface RefreshButtonProps extends IconButtonProps {
  refreshing: boolean;
}

// Component
const RefreshButton: FC<RefreshButtonProps> = (props) => {
  const {
    disabled, refreshing,
    onClick,
    ...btn
  } = props;

  // Render
  const styles = useStyles();

  return (
    <IconButton {...btn}
      classes={{ label: styles.label }} color="inherit"
      disabled={disabled || refreshing}
      onClick={onClick}
    >
      <Fade in={refreshing} unmountOnExit mountOnEnter>
        <CircularProgress size={24} />
      </Fade>
      <Fade in={!refreshing}>
        <RefreshIcon />
      </Fade>
    </IconButton>
  );
};

export default RefreshButton;
