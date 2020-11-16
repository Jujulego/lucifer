import React, { SyntheticEvent, useContext, useEffect, useState } from 'react';

import { Snackbar, Slide, SlideProps } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import { ErrorsContext, ErrorState } from '../errors.context';

// Utils
const SnackSlide = (props: SlideProps) => <Slide {...props} direction="right" />;

// Component
const ErrorsSnackbar = () => {
  // Context
  const { errors } = useContext(ErrorsContext);

  // State
  const [error, setError] = useState<ErrorState>();
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState(0);

  // Effects
  useEffect(() => {
    if (!error) {
      const err = errors.find(err => err.id > last);

      setError(err);
      setOpen(!!err);
    }
  }, [errors, last, error]);

  // Handlers
  const handleClose = (event?: SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return;
    if (error) setLast(error.id);
    setOpen(false);
  };

  const handleExited = () => {
    setError(undefined);
  }

  // Render
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      open={open} autoHideDuration={6000}
      TransitionComponent={SnackSlide}
      onClose={handleClose}
      onExited={handleExited}
    >
      { error && (
        <Alert
          severity='error' elevation={6} variant='filled'
          onClose={handleClose}
        >
          #{ error.id } - { error.error?.toString() }
        </Alert>
      ) }
    </Snackbar>
  );
};

export default ErrorsSnackbar;
