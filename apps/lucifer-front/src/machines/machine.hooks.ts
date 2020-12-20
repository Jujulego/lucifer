import { IMachine } from '@lucifer/types';
import { useAPI } from '@lucifer/react/api';

// Namespace
export const useMachinesAPI = {
  all: (userId: string) => useAPI.get<IMachine[]>(`/api/${userId}/machines`),

  get: (userId: string, id: string) => useAPI.get<IMachine[]>(`/api/${userId}/machines/${id}`),
}

// Hooks
export function useMachines(userId: string) {
  const { data: machines, loading, reload } = useMachinesAPI.all(userId);

  return {
    machines, loading,
    reload
  };
}

export function useMachine(userId: string, id: string) {
  const { data: machine, loading, reload } = useMachinesAPI.get(userId, id);

  return {
    machine, loading,
    reload
  };
}
