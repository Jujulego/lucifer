import React, { ReactNode } from 'react';

import { Grid, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

import { IProject } from '@lucifer/types';

// Styles
const useStyles = makeStyles(({ breakpoints, spacing }) => ({
  root: {
    padding: spacing(3),

    [breakpoints.down('sm')]: {
      padding: spacing(2),
    }
  },
  actions: {
    alignSelf: 'flex-start',
    marginTop:   -spacing(1),
    marginRight: -spacing(1)
  }
}));

// Types
export interface ProjectHeaderProps {
  project?: IProject;
  actions?: ReactNode;
}

// Component
export const ProjectHeader = (props: ProjectHeaderProps) => {
  const { project, actions, } = props;

  // Render
  const styles = useStyles();

  return (
    <Grid className={styles.root} container alignItems="center">
      <Grid item xs zeroMinWidth>
        <Typography variant="h5">
          { project?.name ?? <Skeleton width="50%" /> }
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" noWrap>
          { project?.description ?? <Skeleton width="30%" /> }
        </Typography>
      </Grid>
      <Grid className={styles.actions} item xs="auto">
        { actions }
      </Grid>
    </Grid>
  );
};
