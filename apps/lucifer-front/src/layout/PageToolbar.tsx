import React, { FC } from 'react';

import { makeStyles } from '@material-ui/core';

import { usePageLayout } from './page-layout.context';
import { StyledProps } from '@lucifer/react/utils';

// Types
export type PageToolbarClassKey = 'toolbar';
export type PageToolbarProps = StyledProps<PageToolbarClassKey>;

// Styles
const useStyles = makeStyles({
  toolbar: {
    display: 'grid',
    justifyItems: 'end',

    '& > *': {
      gridArea: '1 / 1 / 2 / 2',
    }
  }
});

// Component
export const PageToolbar: FC<PageToolbarProps> = (props) => {
  const { children } = props;

  // Context
  const { toolbarContainer } = usePageLayout();

  // Render
  const styles = useStyles(props);

  return (
    <div className={styles.toolbar} ref={toolbarContainer}>
      <span>{ children }</span>
    </div>
  );
};
