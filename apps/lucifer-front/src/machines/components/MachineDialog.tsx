import React, { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button, CircularProgress, Dialog, DialogActions, DialogContent, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { IMachine, IUpdateMachine } from '@lucifer/types';
import { ClosableDialogTitle } from '@lucifer/react/basics';
import { useMachinesAPI } from '../machine.hooks';

// Types
export interface MachineDialogProps {
  machine: IMachine | null;
  onSave: (mch: IMachine) => void;
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
const MachineDialog: FC<MachineDialogProps> = (props) => {
  // Props
  const {
    machine,
    onSave, onClose
  } = props;

  // Form
  const { errors, register, handleSubmit, formState, reset } = useForm<IUpdateMachine>({ mode: 'onChange' });

  // API
  const { send: put } = useMachinesAPI.put(machine?.ownerId || '', machine?.id || '');

  // Effects
  useEffect(() => {
    reset(machine || {});
  }, [machine, reset]);

  // Callbacks
  const handleClose = () => {
    if (!formState.isSubmitting) {
      onClose();
    }
  }

  const handleSave = async (data: IUpdateMachine) => {
    const mch = await put(data);
    await onSave(mch);
    onClose();
  }

  // Render
  const styles = useStyles();

  return (
    <Dialog
      open={!!machine}
      onClose={handleClose}

      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit(handleSave)
      }}
    >
      <ClosableDialogTitle onClose={handleClose}>Machine</ClosableDialogTitle>
      <DialogContent>
        <TextField
          className={styles.field}
          variant="outlined" fullWidth
          name="shortName" inputRef={register({ required: true })}
          label="Nom" required
          error={!!errors.shortName} helperText={errors.shortName?.message}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          disabled={formState.isSubmitting}
          onClick={handleClose}
        >
          Annuler
        </Button>
        <div className={styles.wrapper}>
          <Button
            color="primary"
            disabled={formState.isSubmitting || !formState.isValid}
            type="submit"
          >
            Enregistrer
          </Button>
          { formState.isSubmitting && (
            <CircularProgress className={styles.progress} size={24} />
          ) }
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default MachineDialog;
