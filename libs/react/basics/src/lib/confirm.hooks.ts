import { useCallback, useState } from 'react';

// Types
export interface ConfirmState<T> {
  data: T;
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

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
    onCancel: () => null,
    onConfirm: () => null
  });

  // Callbacks
  const confirm = useCallback((data: T) => {
    return new Promise<boolean>(resolve => {
      // Handlers
      const handleClose = (result: boolean) => {
        setState(old => ({
          ...old,
          open: false,
          onCancel: () => null,
          onConfirm: () => null
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
  }, []);

  return { state, confirm };
}
