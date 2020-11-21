import React, { ReactNode } from 'react';
import clsx from 'clsx';

import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { StyledProps } from '@lucifer/react/utils';

// Styles
const useStyles = makeStyles({
  root: {
    position: 'relative',
    width: '100%',

    display: 'inline-flex',
    alignItems: 'center'
  },
  label: {
    position: 'absolute',
    top: -6,
    left: 14,
  },
  content: {
    width: '100%',
    padding: '18.5px 14px',

    fontSize: '1rem',
    lineHeight: '1.1876em',
  },
  endAdorned: {
    paddingRight: 0
  },
  zeroMinWidth: {
    minWidth: 0
  }
});

// Types
export type LabelledTextClassKey = 'root' | 'label' | 'content' | 'endAdornment';
export type LabelledTextProps = StyledProps<LabelledTextClassKey> & {
  label: string;
  zeroMinWidth?: boolean;
  endAdornment?: ReactNode;
  children: ReactNode;
}

// Component
const LabelledText = React.memo((props: LabelledTextProps) => {
  const {
    label, endAdornment,
    zeroMinWidth = false,
    children
  } = props;

  // Render
  const styles = useStyles(props);

  return (
    <div className={styles.root}>
      <Typography className={styles.label} variant='caption'>{ label }</Typography>
      <div className={clsx(styles.content, { [styles.endAdorned]: !!endAdornment, [styles.zeroMinWidth]: zeroMinWidth })}>
        { children }
      </div>
      { endAdornment }
    </div>
  );
});

export default LabelledText;
