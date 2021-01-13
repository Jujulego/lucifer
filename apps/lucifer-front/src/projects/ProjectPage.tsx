import React, { FC, useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { IUpdateProject } from '@lucifer/types';

import { CircularProgress, Fab, Grid, IconButton, Paper, TextField, Typography, Zoom } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Delete, Delete as DeleteIcon, Save as SaveIcon } from '@material-ui/icons';
import { LabelledText, RefreshButton } from '@lucifer/react/basics';

import { useNeedScope } from '../auth/auth.hooks';

import { useProject } from './projects.hooks';
import { ProjectHeader } from './ProjectHeader';

// Styles
const useStyles = makeStyles(({ breakpoints, spacing }) => ({
  root: {
    padding: spacing(3),

    [breakpoints.down('sm')]: {
      padding: spacing(2),
    }
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
interface ProjectParams {
  userId: string;
  id: string;
}

// Component
export const ProjectPage: FC = () => {
  // Router
  const history = useHistory();
  const { userId, id } = useParams<ProjectParams>();

  // API
  const { project, loading, reload, update, remove } = useProject(userId, id);

  // Auth
  const canUpdate = useNeedScope('update:project', usr => project?.adminId === usr?.id);
  const canDelete = useNeedScope('delete:project', usr => project?.adminId === usr?.id);

  // Form
  const { errors, register, reset, handleSubmit, formState } = useForm<IUpdateProject>({
    mode: 'onChange'
  });

  // State
  const [isRemoving, setRemoving] = useState(false);

  // Effects
  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        description: project.description
      });
    }
  }, [reset, project]);

  // Callbacks
  const handleDelete = useCallback(async () => {
    setRemoving(true);
    await remove();
    history.goBack();
  }, [remove, history]);

  // Render
  const styles = useStyles();

  return (
    <>
      <Paper square>
        <ProjectHeader
          project={project}
          actions={(
            <>
              <IconButton disabled={!canDelete || isRemoving} onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
              <RefreshButton disabled={isRemoving} refreshing={loading} onClick={reload} />
            </>
          )}
        />
      </Paper>
      <form className={styles.root} onSubmit={handleSubmit(update)}>
        { project && (
          <Grid container spacing={4} direction="column">
            <Grid item container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                { canUpdate ? (
                  <TextField
                    label="Nom" variant="outlined" fullWidth
                    name="name" inputRef={register({
                      maxLength: { value: 100, message: '100 charactères max.' },
                    })}
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
                { canUpdate ? (
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
        { canUpdate && (
          <Zoom in appear>
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
    </>
  );
};
