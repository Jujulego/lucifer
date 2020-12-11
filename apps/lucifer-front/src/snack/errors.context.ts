import { createContext } from 'react';

// Types
export interface ErrorState {
  id: number;
  date: Date;
  error: any;
  seen: boolean;
}

export interface ErrorsContextProps {
  errors: ErrorState[];
  addError: (error: any) => void;
  seenError: (id: number) => void;
}

// Defaults
const errorsDefaults: ErrorsContextProps = {
  errors: [],
  addError: () => console.warn('Trying to use uninitialized ErrorsContext'),
  seenError: () => console.warn('Trying to use uninitialized ErrorsContext')
};

// Context
export const ErrorsContext = createContext(errorsDefaults);
