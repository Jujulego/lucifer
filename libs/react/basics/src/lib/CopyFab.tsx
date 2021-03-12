import React, { MouseEvent, useState, useEffect, FC } from 'react';
import copy from 'copy-to-clipboard';
import clsx from 'clsx';

import { Fab, FabProps, FabClassKey, Fade } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import { StyledProps } from '@lucifer/react-utils';

// Types
export type CopyFabClassKey = FabClassKey | 'succeed';
export interface CopyFabProps extends Omit<FabProps, 'classes' | 'children'>, StyledProps<CopyFabClassKey> {
  /** Content to be copied */
  text: string;

  /**
   * Mime type of content
   * @default text/plain
   */
  format?: string;

  /** Copied callback, called after a successful copy */
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
const CopyFab: FC<CopyFabProps> = (props) => {
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
  const styles = useStyles({
    classes: {
      succeed: classes?.succeed,
      label: classes?.label
    }
  });

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
