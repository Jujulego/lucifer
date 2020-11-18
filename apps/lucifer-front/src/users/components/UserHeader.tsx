import React, { ReactNode } from 'react';

import { Avatar, Grid, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

import { IUser } from '@lucifer/types';
import { initials } from '@lucifer/utils';

import { RefreshButton } from '../../basics/components';

// Styles
const useStyles = makeStyles(({ breakpoints, spacing }) => ({
  root: {
    padding: spacing(3),

    [breakpoints.down('sm')]: {
      padding: spacing(2),
    }
  },
  username: {
    marginLeft: spacing(2)
  },
  actions: {
    alignSelf: 'flex-start',
    marginTop:   -spacing(1),
    marginRight: -spacing(1)
  },
  avatar: {
    height: spacing(9),
    width:  spacing(9),

    [breakpoints.down('sm')]: {
      height: spacing(8),
      width:  spacing(8),
    }
  }
}));

// Types
export interface UserHeaderProps {
  user?: IUser;
  loading: boolean;
  actions?: ReactNode;
  onReload: () => void;
}

// Component
const UserHeader = (props: UserHeaderProps) => {
  const {
    user, loading,
    actions,
    onReload
  } = props;

  // Render
  const styles = useStyles();

  return (
    <Grid className={styles.root} container alignItems="center">
      <Grid item xs="auto">
        { user ? (
          <Avatar className={styles.avatar} alt={user.name} src={user.picture}>
            { initials(user.name) }
          </Avatar>
        ) : (
          <Skeleton variant="circle" className={styles.avatar} />
        ) }
      </Grid>
      <Grid className={styles.username} item xs>
        <Typography variant="h5">
          { user ? user.name : <Skeleton width="50%" /> }
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          { user ? user.email : <Skeleton width="30%" /> }
        </Typography>
      </Grid>
      <Grid className={styles.actions} item xs="auto">
        { actions }
        <RefreshButton refreshing={loading} onClick={onReload} />
      </Grid>
    </Grid>
  );
};

export default UserHeader;
