import React, { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

import { TextField } from '@material-ui/core';

import { IApiKey, IUpdateApiKey, updateApiKeySchema } from '@lucifer/types';

import { FormDialog } from '../../layout/FormDialog';
import { handleAPIErrors } from '../../utils/form';

import { useApiKeysAPI } from './api-keys.hooks';

// Types
export interface UpdateApiKeyDialogProps {
  open: boolean;
  apiKey?: IApiKey;
  onUpdated: (apk: IApiKey) => void;
  onClose: () => void;
}

// Component
export const UpdateApiKeyDialog: FC<UpdateApiKeyDialogProps> = (props) => {
  const { open, apiKey, onUpdated, onClose } = props;

  // Form
  const { errors, register, handleSubmit, formState, setError, reset } = useForm<IUpdateApiKey>({
    mode: 'onChange',
    resolver: yupResolver(updateApiKeySchema)
  });

  // API
  const { send: update } = useApiKeysAPI.put(apiKey?.projectId || '', apiKey?.id || '');

  // Effects
  useEffect(() => {
    if (apiKey) {
      reset({
        label: apiKey.label
      });
    }
  }, [reset, apiKey]);

  // Callbacks
  const handleClose = () => {
    if (!formState.isSubmitting) {
      onClose();
    }
  };

  const handleUpdate = async (data: IUpdateApiKey) => {
    try {
      const apk = await update(data);
      onUpdated(apk);
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
      title="Editer une clé d'API"
      submitText="Sauver"
      isSubmitting={formState.isSubmitting}
      isValid={formState.isValid}
      onClose={handleClose}
      onSubmit={handleSubmit(handleUpdate)}
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
