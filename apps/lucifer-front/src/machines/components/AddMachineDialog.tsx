import React, { FC } from 'react';
import { useForm } from 'react-hook-form';

import { Button, CircularProgress, Dialog, DialogActions, DialogContent, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { ICreateMachine } from '@lucifer/types';
import { ClosableDialogTitle } from '@lucifer/react/basics';

// Types
export interface AddMachineDialogProps {
  open: boolean;
  onAdd: (data: ICreateMachine) => void;
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
const AddMachineDialog: FC<AddMachineDialogProps> = (props) => {
  // Props
  const {
    open,
    onAdd, onClose
  } = props;

  // Form
  const { errors, register, handleSubmit, formState } = useForm<ICreateMachine>({ mode: 'onChange' });

  // Callbacks
  const handleClose = () => {
    if (!formState.isSubmitting) {
      onClose();
    }
  }

  const handleAdd = async (data: ICreateMachine) => {
    await onAdd(data);
    onClose();
  }

  // Render
  const styles = useStyles();

  return (
    <Dialog
      open={open}
      onClose={handleClose}

      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit(handleAdd)
      }}
    >
      <ClosableDialogTitle onClose={handleClose}>Nouvelle machine</ClosableDialogTitle>
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
            Créer
          </Button>
          { formState.isSubmitting && (
            <CircularProgress className={styles.progress} size={24} />
          ) }
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default AddMachineDialog;
