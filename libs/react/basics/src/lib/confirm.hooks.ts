import { useCallback, useState } from 'react';

// Types
interface ConfirmClosedState<T> {
  data: T;
  open: false;
  onCancel?: () => void;
  onConfirm?: () => void;
}

interface ConfirmOpenedState<T> {
  data: T;
  open: true;
  onCancel: () => void;
  onConfirm: () => void;
}

export type ConfirmState<T> = ConfirmOpenedState<T> | ConfirmClosedState<T>;
export interface ConfirmReturn<T> {
  readonly state: ConfirmState<T>;
  confirm: (data: T) => Promise<boolean>;
}

// Hook
export function useConfirm<T>(init: T): ConfirmReturn<T> {
  // State
  const [state, setState] = useState<ConfirmState<T>>({
    open: false,
    data: init,
  });

  // Callbacks
  const confirm = useCallback((data: T) => {
    return new Promise<boolean>(resolve => {
      // Handlers
      const handleClose = (result: boolean) => {
        setState(old => ({
          ...old,
          open: false
        }));

        resolve(result);
      };

      // Activate dialog
      setState({
        open: true, data,
        onCancel: () => handleClose(false),
        onConfirm: () => handleClose(true)
      });
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { state, confirm };
}
