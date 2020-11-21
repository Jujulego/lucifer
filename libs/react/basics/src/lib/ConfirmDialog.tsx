import React, { ReactNode } from 'react';

import { Button, Dialog, DialogActions, DialogProps } from '@material-ui/core';

import { ConfirmState } from './confirm.hooks';

// Types
export type ConfirmDialogProps<T> = Omit<DialogProps, 'open' | 'onClose'> & {
  state: ConfirmState<T>,
  children: (data: T) => ReactNode
}

// Component
const ConfirmDialog = <T extends never = never> (props: ConfirmDialogProps<T>) => {
  const {
    state,
    children,
    ...dialog
  } = props;

  // Render
  return (
    <Dialog {...dialog} open={state.open} onClose={state.onCancel}>
      { children(state.data) }
      <DialogActions>
        <Button color="secondary" onClick={state.onCancel}>Annuler</Button>
        <Button color="primary" onClick={state.onConfirm}>Confirmer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
