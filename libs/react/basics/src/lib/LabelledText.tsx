import React, { FC, ReactNode } from 'react';
import clsx from 'clsx';

import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { StyledProps } from '@lucifer/react-utils';

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
export interface LabelledTextProps extends StyledProps<LabelledTextClassKey> {
  /** Associated label */
  label: string;

  /** Allow to add an adornment at the end of the field like on inputs */
  endAdornment?: ReactNode;

  /**
   * Related to the Grid's limitations
   * @see https://material-ui.com/components/grid/#white-space-nowrap
   * @default false
   */
  zeroMinWidth?: boolean;
}

// Component
/**
 * Mimics appearance of TextField for simple text value
 * @see https://material-ui.com/api/text-field/
 */
const LabelledText: FC<LabelledTextProps> = (props) => {
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
      <div
        className={clsx(styles.content, { [styles.endAdorned]: !!endAdornment, [styles.zeroMinWidth]: zeroMinWidth })}
        aria-label={label}
      >
        { children }
      </div>
      { endAdornment }
    </div>
  );
};

export default LabelledText;
