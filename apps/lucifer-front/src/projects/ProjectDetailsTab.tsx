import React, { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';

import { CircularProgress, Fab, Grid, TextField, Typography, Zoom } from '@material-ui/core';
import { Save as SaveIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { LabelledText } from '@lucifer/react-basics';
import { IProject, IUpdateProject, updateProjectSchema } from '@lucifer/types';

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
  description: {
    whiteSpace: 'pre-line'
  },
  save: {
    position: 'absolute',
    bottom: spacing(2),
    right: spacing(2)
  }
}));

// Types
interface ProjectDetailsProps {
  project?: IProject;
  isRemoving: boolean;
  onUpdate: (update: IUpdateProject) => void;
}

// Component
export const ProjectDetailsTab: FC<ProjectDetailsProps> = (props) => {
  const {
    project, isRemoving,
    onUpdate
  } = props;

  // Context
  const { open } = usePageTab();

  // Auth
  const isAdmin = useNeedRole('admin', usr => project?.adminId === usr?.id) ?? false;

  // Form
  const { errors, register, reset, handleSubmit, formState } = useForm<IUpdateProject>({
    mode: 'onChange',
    resolver: yupResolver(updateProjectSchema)
  });

  // Effects
  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        description: project.description
      });
    }
  }, [reset, project]);

  // Render
  const styles = useStyles();

  return (
    <form
      className={clsx(styles.root, { [styles.hidden]: !open })}
      onSubmit={handleSubmit(onUpdate)}
    >
      { (open && project) && (
        <Grid container spacing={4} direction="column">
          <Grid item container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              { isAdmin ? (
                <TextField
                  label="Nom" variant="outlined" fullWidth
                  name="name" inputRef={register}
                  error={!!errors.name} helperText={errors.name?.message}
                />
              ) : (
                <LabelledText label="Nom">
                  <Typography>{ project.name }</Typography>
                </LabelledText>
              ) }
            </Grid>
          </Grid>
          <Grid item container spacing={2}>
            <Grid item xs>
              { isAdmin ? (
                <TextField
                  label="Description" variant="outlined" fullWidth multiline
                  name="description" inputRef={register}
                  error={!!errors.description} helperText={errors.description?.message}
                />
              ) : (
                <LabelledText label="Description">
                  <Typography className={styles.description}>{ project.description }</Typography>
                </LabelledText>
              ) }
            </Grid>
          </Grid>
        </Grid>
      ) }
      { isAdmin && (
        <Zoom in={open}>
          <Fab
            className={styles.save} color="primary"
            type="submit" disabled={!formState.isDirty || formState.isSubmitting || isRemoving}
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
