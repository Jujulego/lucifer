import React, { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import slugify from 'slugify';

import { Button, CircularProgress, Dialog, DialogActions, DialogContent, Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

import { ICreateProject } from '@lucifer/types';
import { ClosableDialogTitle } from '@lucifer/react/basics';

// Types
export interface AddProjectDialogProps {
  open: boolean;
  onAdd: (data: ICreateProject) => void;
  onClose: () => void;
}

// Styles
const useStyles = makeStyles(({ spacing }) => ({
  field: {
    marginBottom: spacing(2)
  },
  wrapper: {
    position: 'relative'
  },
  progress: {
    position: 'absolute',
    top: 'calc(50% - 12px)',
    left: 'calc(50% - 12px)',
  }
}));

// Component
export const AddProjectDialog: FC<AddProjectDialogProps> = (props) => {
  // Props
  const { open, onAdd, onClose } = props;

  // Form
  const { errors, register, handleSubmit, formState, watch, setValue } = useForm<ICreateProject>({
    mode: 'onChange'
  });

  const fields = watch(['id', 'name']);

  // Effects
  useEffect(() => {
    if (fields.name) {
      const id = slugify(fields.name, { lower: true });
      setValue('id', id, { shouldValidate: true });
    }
  }, [fields.name, setValue]);

  // Callbacks
  const handleClose = () => {
    if (!formState.isSubmitting) {
      onClose();
    }
  };

  const handleAdd = async (data: ICreateProject) => {
    await onAdd(data);
    onClose();
  };

  // Render
  const styles = useStyles();

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      onClose={handleClose}

      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit(handleAdd)
      }}
    >
      <ClosableDialogTitle onClose={handleClose}>Nouveau projet</ClosableDialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              className={styles.field}
              variant="outlined" fullWidth
              name="name" inputRef={register({
              required: true,
              maxLength: { value: 100, message: '100 charactères max.' }
            })}
              label="Nom" required
              error={!!errors.name} helperText={errors.name?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              className={styles.field}
              variant="outlined" fullWidth
              name="id" inputRef={register({
              required: true,
              maxLength: { value: 100, message: '100 charactères max.' },
              pattern: { value: /^[a-z0-9-]+$/, message: 'charactères autorisés: a-z, 0-9, -' }
            })}
              InputLabelProps={{
                shrink: !!fields.id
              }}
              label="Slug" required
              error={!!errors.id} helperText={errors.id?.message}
            />
          </Grid>
        </Grid>
        <TextField
          variant="outlined" fullWidth multiline
          name="description" inputRef={register({ required: false })}
          label="Description"
          error={!!errors.description} helperText={errors.description?.message}
        />
      </DialogContent>
      <DialogActions>
        <div className={styles.wrapper}>
          <Button
            color="primary"
            disabled={formState.isSubmitting || !formState.isValid}
            type="submit"
          >
            Créer
          </Button>
          { formState.isSubmitting && (
            <CircularProgress className={styles.progress} size={24} />
          ) }
        </div>
      </DialogActions>
    </Dialog>
  );
};
