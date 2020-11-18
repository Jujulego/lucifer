import { isEqual } from 'lodash';

import usePrevious from './usePrevious';

// Hook
function useChanged<T>(obj: T): boolean {
  return isEqual(obj, usePrevious<T>(obj));
}

export default useChanged;