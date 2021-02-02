import { AxiosError } from 'axios';
import { FieldName, FieldValues, UseFormMethods } from 'react-hook-form';

// Utils
export function handleAPIErrors<T extends FieldValues>(error: AxiosError, idField: FieldName<T>, setError: UseFormMethods<T>['setError']) {
  const res = error.response;

  switch (res?.status) {
    case 400: // Bad Request
      res.data.message.forEach((msg: string) => {
        const name = msg.split(' ')[0] as FieldName<T>;
        setError(name, { message: msg });
      });

      break;

    case 409: // Conflict
      setError(idField, { message: res.data.message, shouldFocus: true });

      break;

    default:
      throw error;
  }
}
