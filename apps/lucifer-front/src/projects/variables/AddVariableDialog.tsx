import React, { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import slugify from 'slugify';

import { Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

import { ICreateVariable, createVariableSchema } from '@lucifer/types';

import { FormDialog } from '../../layout/FormDialog';
import { handleAPIErrors } from '../../utils/form';

// Types
export interface AddVariableDialogProps {
  open: boolean;
  onAdd: (data: ICreateVariable) => void;
  onClose: () => void;
}

// Styles
const useStyles = makeStyles(({ spacing }) => ({
  field: {
    marginBottom: spacing(2)
  }
}));

// Component
export const AddVariableDialog: FC<AddVariableDialogProps> = (props) => {
  const { open, onAdd, onClose } = props;

  // Form
  const { errors, register, handleSubmit, formState, watch, setValue, setError } = useForm<ICreateVariable>({
    mode: 'onChange',
    resolver: yupResolver(createVariableSchema)
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

  const handleAdd = async (data: ICreateVariable) => {
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
      title="Nouvelle variable"
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
            label="Nom" required
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
            label="Slug" required
            error={!!errors.id} helperText={errors.id?.message}
          />
        </Grid>
      </Grid>
      <TextField
        variant="outlined" fullWidth multiline
        name="value" inputRef={register}
        label="Valeur" required
        error={!!errors.value} helperText={errors.value?.message}
      />
    </FormDialog>
  );
};
