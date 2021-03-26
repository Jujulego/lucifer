import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

import { TextField } from '@material-ui/core';

import { ICreateApiKey, createApiKeySchema } from '@lucifer/types';

import { FormDialog } from '../../layout/FormDialog';
import { handleAPIErrors } from '../../utils/form';

// Types
export interface AddApiKeyDialogProps {
  open: boolean;
  onAdd: (data: ICreateApiKey) => void;
  onClose: () => void;
}

// Component
export const AddApiKeyDialog: FC<AddApiKeyDialogProps> = (props) => {
  const { open, onAdd, onClose } = props;

  // Form
  const { errors, register, handleSubmit, formState, setError } = useForm<ICreateApiKey>({
    mode: 'onChange',
    resolver: yupResolver(createApiKeySchema)
  });

  // Callbacks
  const handleClose = () => {
    if (!formState.isSubmitting) {
      onClose();
    }
  };

  const handleAdd = async (data: ICreateApiKey) => {
    try {
      await onAdd(data);
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        handleAPIErrors(error, null, setError);
      }
    }
  };

  // Render
  return (
    <FormDialog
      open={open}
      title="Nouvelle clé API"
      submitText="Créer"
      isSubmitting={formState.isSubmitting}
      isValid={formState.isValid}
      onClose={handleClose}
      onSubmit={handleSubmit(handleAdd)}
    >
      <TextField
        variant="outlined" fullWidth
        name="label" inputRef={register}
        label="Label" id="add-api-key-label" required
        error={!!errors.label} helperText={errors.label?.message}
      />
    </FormDialog>
  );
};
