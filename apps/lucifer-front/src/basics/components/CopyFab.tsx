import React, { MouseEvent, useState, useEffect } from 'react';
import copy from 'copy-to-clipboard';
import clsx from 'clsx';
import { pick } from 'lodash';

import {
  Fade,
  Fab, FabProps, FabClassKey
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import { StyledProps } from '../../utils/style';

// Types
export type CopyFabClassKey = FabClassKey | 'succeed';
export type CopyFabProps = Omit<FabProps, 'classes' | 'children'> & StyledProps<CopyFabClassKey> & {
  text: string;
  format?: string;

  onCopied?: () => void;
}

// Styles
const useStyles = makeStyles(({ palette }: Theme) => ({
  label: {
    display: 'grid',
    justifyItems: 'center',

    '& > *': {
      gridArea: '1 / 1 / 2 / 2',
    }
  },
  succeed: {
    backgroundColor: palette.success.main,

    '&:hover': {
      backgroundColor: palette.success.dark,
    }
  }
}));

// Component
const CopyFab = (props: CopyFabProps) => {
  // Props
  const {
    text, classes,
    format = "text/plain",
    onCopied, onClick,
    ...btn
  } = props;

  // State
  const [succeed, setSucceed] = useState(false);

  // Effects
  useEffect(() => {
    if (succeed) {
      const id = setTimeout(() => setSucceed(false), 2000);
      return () => clearTimeout(id);
    }
  }, [succeed, setSucceed]);

  // Handler
  const handleCopy = (event: MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(event);

    // Copy
    const success = copy(text, { format });
    if (success) {
      setSucceed(true);
      if (onCopied) onCopied();
    }
  };

  // Render
  const styles = useStyles({ classes: pick(classes, ['succeed', 'label']) });

  return (
    <Fab
      {...btn} onClick={handleCopy}
      classes={{
        ...classes,
        root: clsx(classes?.root, { [styles.succeed]: succeed }),
        label: styles.label,
      }}
    >
      <Fade in={succeed} timeout={250}>
        <CheckIcon />
      </Fade>
      <Fade in={!succeed} timeout={250}>
        <FileCopyIcon fontSize="small" />
      </Fade>
    </Fab>
  );
};

export default CopyFab;
