import { AxiosError } from 'axios';
import { FieldName, FieldValues, UseFormMethods } from 'react-hook-form';

// Types
interface ValidationError<T extends FieldValues> {
  path: FieldName<T>;
  type?: string;
  errors: string[];
}

// Utils
export function handleAPIErrors<T extends FieldValues>(error: AxiosError, idField: FieldName<T>, setError: UseFormMethods<T>['setError']) {
  const res = error.response;

  switch (res?.status) {
    case 400: // Bad Request
      for (const { path, type, errors } of res.data.message as ValidationError<T>[]) {
        setError(path, { type, message: errors[0] });
      }

      break;

    case 409: // Conflict
      setError(idField, { message: res.data.message, shouldFocus: true });

      break;

    default:
      throw error;
  }
}
