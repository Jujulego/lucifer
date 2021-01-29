import React, { ReactNode, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import clsx from 'clsx';

import { Chip, CircularProgress, Fab, Grid, TextField, Tooltip, Typography, Zoom } from '@material-ui/core';
import { Check as CheckIcon, Save as SaveIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { LabelledText, RelativeDate } from '@lucifer/react/basics';
import { ChipSelect } from '@lucifer/react/fields';
import { IUpdateUser, IUser, ROLES } from '@lucifer/types';

import { useNeedRole } from '../auth/auth.hooks';
import { usePageTab } from '../layout/page-tab.context';

// Styles
const useStyles = makeStyles(({ spacing }) => ({
  root: {
    padding: spacing(3),
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
  onUpdate: (update: IUpdateUser) => void;
}

// Component
export const UserDetailsTab = (props: UserDetailsProps) => {
  const {
    user,
    onUpdate
  } = props;

  // Context
  const { open } = usePageTab();

  // Auth
  const isAdmin = useNeedRole('admin');
  const isAllowed = useNeedRole('admin', usr => usr?.id === user?.id);

  // Form
  const { errors, control, register, reset, handleSubmit, formState } = useForm<IUpdateUser>();

  // Effects
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        roles: user.roles
      });
    }
  }, [reset, user, open]);

  // Render
  const styles = useStyles();

  return (
    <form
      className={clsx(styles.root, { [styles.hidden]: !open })}
      onSubmit={isAdmin ? handleSubmit(onUpdate) : undefined}
    >
      { (open && user) && (
        <Grid container spacing={4} direction="column">
          <GridLine>
            <GridItem>
              { isAllowed ? (
                <TextField
                  label="Nom" variant="outlined" fullWidth
                  name="name" inputRef={register}
                  disabled={!user.canUpdate}
                  error={!!errors.name} helperText={errors.name?.message}
                />
              ) : (
                <LabelledText label="Nom">
                  <Typography>{ user.name }</Typography>
                </LabelledText>
              ) }
            </GridItem>
            <GridItem>
              { isAllowed ? (
                <TextField
                  label="Email" variant="outlined" fullWidth
                  name="email" inputRef={register}
                  disabled={!user.canUpdate}
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
          { (user.roles) && (
            <GridLine>
              <Grid item xs={12}>
                { isAdmin ? (
                  <Controller
                    name="roles" control={control}
                    as={ChipSelect} options={ROLES}
                    label="Roles" fullWidth variant="outlined"
                  />
                ) : (
                  <LabelledText label="Roles">
                    { user.roles.map(role => (
                      <Chip key={role} className={styles.chips} label={role} />
                    )) }
                  </LabelledText>
                ) }
              </Grid>
            </GridLine>
          ) }
        </Grid>
      ) }
      { isAdmin && (
        <Zoom in={open}>
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
