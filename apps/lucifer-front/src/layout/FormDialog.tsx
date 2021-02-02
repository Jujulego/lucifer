import React, { FC, FormEventHandler } from 'react';

import { Button, CircularProgress, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

import { ClosableDialogTitle } from '@lucifer/react/basics';

// Types
export interface FormDialogProps {
  open: boolean;
  title: string;
  submitText: string;
  isSubmitting: boolean;
  isValid: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onClose: () => void;
}

// Styles
const useStyles = makeStyles({
  wrapper: {
    position: 'relative'
  },
  progress: {
    position: 'absolute',
    top: 'calc(50% - 12px)',
    left: 'calc(50% - 12px)',
  }
});

// Component
export const FormDialog: FC<FormDialogProps> = (props) => {
  const {
    open, title, submitText,
    isSubmitting, isValid,
    onSubmit, onClose,
    children
  } = props;

  // Render
  const styles = useStyles();

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      onClose={onClose}

      PaperProps={{
        component: 'form',
        onSubmit: onSubmit as unknown as FormEventHandler<HTMLDivElement>
      }}
    >
      <ClosableDialogTitle onClose={onClose}>{ title }</ClosableDialogTitle>
      <DialogContent>{ children }</DialogContent>
      <DialogActions>
        <div className={styles.wrapper}>
          <Button
            color="primary"
            type="submit"
            disabled={isSubmitting || !isValid}
          >
            { submitText }
          </Button>
          { isSubmitting && (
            <CircularProgress className={styles.progress} size={24} />
          ) }
        </div>
      </DialogActions>
    </Dialog>
  );
}
