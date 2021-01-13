import React, { ReactNode, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';

import { CircularProgress, Fab, Grid, TextField, Tooltip, Typography, Zoom } from '@material-ui/core';
import { Check as CheckIcon, Save as SaveIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { LabelledText, RelativeDate } from '@lucifer/react/basics'
import { IUpdateUser, IUser } from '@lucifer/types';

import { useAuth } from '../../auth/auth.context';
import { useNeedScope } from '../../auth/auth.hooks';

import PermissionChip from './PermissionChip';

// Styles
const useStyles = makeStyles(({ breakpoints, spacing }) => ({
  root: {
    padding: spacing(3),

    [breakpoints.down('sm')]: {
      padding: spacing(2),
    }
  },
  hidden: {
    padding: 0
  },
  chips: {
    marginRight: spacing(1),
    marginBottom: spacing(1),

    '&:last-child': {
      marginRight: 0
    }
  },
  save: {
    position: 'absolute',
    bottom: spacing(2),
    right: spacing(2)
  }
}));

// Utils
interface GridProps {
  children: ReactNode
}

const GridLine = ({ children }: GridProps) => (
  <Grid item container spacing={2}>
    { children }
  </Grid>
);

const GridItem = ({ children }: GridProps) => (
  <Grid item xs={12} sm={6} md={4}>
    { children }
  </Grid>
);

// Types
export interface UserDetailsProps {
  user?: IUser;
  show?: boolean;
  onUpdate: (update: IUpdateUser) => void;
}

// Component
const UserDetailsTab = (props: UserDetailsProps) => {
  const {
    user, show = false,
    onUpdate
  } = props;

  // Auth
  const { user: me, permissions = [] } = useAuth();
  const canUpdate = useNeedScope('update:users', usr => usr?.id === user?.id);

  // Form
  const { errors, register, reset, handleSubmit, formState } = useForm<IUpdateUser>();

  // Effects
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email
      });
    }
  }, [reset, user, show]);

  // Render
  const styles = useStyles();

  return (
    <form
      className={clsx(styles.root, { [styles.hidden]: !show })}
      onSubmit={canUpdate ? handleSubmit(onUpdate) : undefined}
    >
      { (show && user) && (
        <Grid container spacing={4} direction="column">
          <GridLine>
            <GridItem>
              { canUpdate ? (
                <TextField
                  label="Nom" variant="outlined" fullWidth
                  name="name" inputRef={register}
                  error={!!errors.name} helperText={errors.name?.message}
                />
              ) : (
                <LabelledText label="Nom">
                  <Typography>{ user.name }</Typography>
                </LabelledText>
              ) }
            </GridItem>
            <GridItem>
              { canUpdate ? (
                <TextField
                  label="Email" variant="outlined" fullWidth
                  name="email" inputRef={register}
                  error={!!errors.email} helperText={errors.email?.message}
                  InputProps={{
                    endAdornment: user.emailVerified && (
                      <Tooltip title="Vérifié">
                        <CheckIcon color="primary" />
                      </Tooltip>
                    )
                  }}
                />
              ) : (
                <LabelledText label="Email"
                  endAdornment={
                    user.emailVerified && (
                      <Tooltip title="Vérifié">
                        <CheckIcon color="primary" />
                      </Tooltip>
                    )
                  }
                >
                  <Typography>{ user.email }</Typography>
                </LabelledText>
              ) }
            </GridItem>
            <GridItem>
              <LabelledText label="Dernière connexion">
                { user.lastLogin && (
                  <RelativeDate mode="from" date={user.lastLogin} />
                ) }
              </LabelledText>
            </GridItem>
          </GridLine>
          <GridLine>
            <GridItem>
              { (me?.id === user.id) && (
                <LabelledText label="Permissions">
                  { permissions.map(perm => (
                    <PermissionChip key={perm} className={styles.chips} permission={perm} />
                  )) }
                </LabelledText>
              ) }
            </GridItem>
          </GridLine>
        </Grid>
      ) }
      { canUpdate && (
        <Zoom in={show}>
          <Fab
            className={styles.save} color="primary"
            type="submit" disabled={!formState.isDirty || formState.isSubmitting}
          >
            <SaveIcon />
          </Fab>
        </Zoom>
      ) }
      { formState.isSubmitting && (
        <CircularProgress className={styles.save} size={56} />
      ) }
    </form>
  );
};

export default UserDetailsTab;
