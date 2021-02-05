import React, { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import slugify from 'slugify';

import { Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

import { createProjectSchema, ICreateProject } from '@lucifer/types';

import { FormDialog } from '../layout/FormDialog';
import { handleAPIErrors } from '../utils/form';

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
  }
}));

// Component
export const AddProjectDialog: FC<AddProjectDialogProps> = (props) => {
  const { open, onAdd, onClose } = props;

  // Form
  const { errors, register, handleSubmit, formState, watch, setValue, setError } = useForm<ICreateProject>({
    mode: 'onChange',
    resolver: yupResolver(createProjectSchema),
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
    try {
      await onAdd(data);
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        handleAPIErrors(error, 'id', setError);
      }
    }
  };

  // Render
  const styles = useStyles();

  return (
    <FormDialog
      open={open}
      title="Nouveau projet"
      submitText="Créer"
      isSubmitting={formState.isSubmitting}
      isValid={formState.isValid}
      onClose={handleClose}
      onSubmit={handleSubmit(handleAdd)}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            className={styles.field}
            variant="outlined" fullWidth
            name="name" inputRef={register}
            id="add-project-name" label="Nom" required
            error={!!errors.name} helperText={errors.name?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className={styles.field}
            variant="outlined" fullWidth
            name="id" inputRef={register}
            InputLabelProps={{
              shrink: !!fields.id
            }}
            id="add-project-id" label="Slug" required
            error={!!errors.id} helperText={errors.id?.message}
          />
        </Grid>
      </Grid>
      <TextField
        variant="outlined" fullWidth multiline
        name="description" inputRef={register}
        id="add-project-description" label="Description"
        error={!!errors.description} helperText={errors.description?.message}
      />
    </FormDialog>
  );
};
