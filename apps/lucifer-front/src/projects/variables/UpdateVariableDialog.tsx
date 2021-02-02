import React, { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

import { IUpdateVariable, IVariable, updateVariableSchema } from '@lucifer/types';
import { FormDialog } from '../../layout/FormDialog';
import { handleAPIErrors } from '../../utils/form';

import { useVariablesAPI } from './variables.hooks';

// Types
export interface UpdateVariableDialogProps {
  open: boolean;
  variable?: IVariable;
  onUpdated: (vrb: IVariable) => void;
  onClose: () => void;
}

// Styles
const useStyles = makeStyles(({ spacing }) => ({
  field: {
    marginBottom: spacing(2)
  }
}));

// Component
export const UpdateVariableDialog: FC<UpdateVariableDialogProps> = (props) => {
  const { open, variable, onUpdated, onClose } = props;

  // Form
  const { errors, register, handleSubmit, formState, setError, reset } = useForm<IUpdateVariable>({
    mode: 'onChange',
    resolver: yupResolver(updateVariableSchema)
  });

  // API
  const { send: update } = useVariablesAPI.put(
    variable?.adminId || '', variable?.projectId || '', variable?.id || ''
  );

  // Effects
  useEffect(() => {
    if (variable) {
      reset({
        name: variable.name,
        value: variable.value
      });
    }
  }, [reset, variable]);

  // Callbacks
  const handleClose = () => {
    if (!formState.isSubmitting) {
      onClose();
    }
  };

  const handleUpdate = async (data: IUpdateVariable) => {
    try {
      const vrb = await update(data);
      onUpdated(vrb);
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
      title="Editer variable"
      submitText="Sauver"
      isSubmitting={formState.isSubmitting}
      isValid={formState.isValid}
      onClose={handleClose}
      onSubmit={handleSubmit(handleUpdate)}
    >
      <TextField
        className={styles.field}
        variant="outlined" fullWidth
        name="name" inputRef={register}
        label="Nom" required
        error={!!errors.name} helperText={errors.name?.message}
      />
      <TextField
        variant="outlined" fullWidth multiline
        name="value" inputRef={register}
        label="Valeur" required
        error={!!errors.value} helperText={errors.value?.message}
      />
    </FormDialog>
  );
};
