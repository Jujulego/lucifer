import { AxiosError } from 'axios';
import { FieldName, FieldValues, UseFormMethods } from 'react-hook-form';

import { ValidationError } from '@lucifer/types';

// Utils
export function handleAPIErrors<T extends FieldValues>(error: AxiosError, idField: FieldName<T> | null, setError: UseFormMethods<T>['setError']) {
  const res = error.response;

  switch (res?.status) {
    case 400: // Bad Request
      for (const { path, type, errors } of res.data.message as ValidationError<T>[]) {
        setError(path as FieldName<T>, { type, message: errors[0] });
      }

      break;

    case 409: // Conflict
      if (idField) {
        setError(idField, { type: 'conflict', message: res.data.message, shouldFocus: true });
      } else {
        throw error;
      }

      break;

    default:
      throw error;
  }
}
