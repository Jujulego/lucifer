import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import axios, { AxiosResponse } from 'axios';

import { ErrorsContext, ErrorState } from '../../snack/errors.context';

// Types
export interface ErrorsProps {
  children?: ReactNode
}

// Component
const CatchErrors = (props: ErrorsProps) => {
  const { children } = props;

  // State
  const [errors, setErrors] = useState<ErrorState[]>([]);

  // Ref
  const id = useRef(0);

  // Handlers
  const addError = useCallback((error: any) => {
    setErrors(old => [...old, { id: ++(id.current), error, date: new Date(), seen: false }]);
  }, [setErrors]);

  const seenError = useCallback((id: number) => {
    setErrors(old => old.map(err => err.id === id ? ({ ...err, seen: true }) : err));
  }, [setErrors]);

  // Effects
  useEffect(() => {
    const id = axios.interceptors.response.use(
      rep => rep,
      error => {
        if (error && !axios.isCancel(error)) {
          if (error.isAxiosError) {
            const { status, data } = error.response as AxiosResponse;
            const msg = (data.message ? data.message : data).toString();

            addError(`${status}: ${msg}`);
          } else {
            addError(error);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(id);
  }, [addError]);

  // Render
  return (
    <ErrorsContext.Provider
      value={{ errors, addError, seenError }}
    >
      { children }
    </ErrorsContext.Provider>
  );
};

export default CatchErrors;
