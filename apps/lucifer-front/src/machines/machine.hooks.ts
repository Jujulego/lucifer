import { useCallback } from 'react';

import { useAPI } from '@lucifer/react/api';
import { ICreateMachine, IMachine, IUpdateMachine } from '@lucifer/types';

// Namespace
export const useMachinesAPI = {
  all: (ownerId: string) => useAPI.get<IMachine[]>(`/api/${ownerId}/machines`),
  create: (ownerId: string) => useAPI.post<ICreateMachine, IMachine>(`/api/${ownerId}/machines`),

  get: (ownerId: string, id: string) => useAPI.get<IMachine>(`/api/${ownerId}/machines/${id}`),
  put: (ownerId: string, id: string) => useAPI.put<IUpdateMachine, IMachine>(`/api/${ownerId}/machines/${id}`),
}

// Hooks
export function useMachines(ownerId: string) {
  const { data: machines, loading, reload, update } = useMachinesAPI.all(ownerId);
  const { send: create } = useMachinesAPI.create(ownerId);

  return {
    machines, loading,
    reload,
    updateCache: update,
    create: useCallback(async (data: ICreateMachine) => {
      const mch = await create(data);
      update((machines = []) => [...machines, mch]);

      return mch;
    }, [create, update])
  };
}

export function useMachine(ownerId: string, id: string) {
  const { data: machine, loading, reload, update } = useMachinesAPI.get(ownerId, id);
  const { send: put } = useMachinesAPI.put(ownerId, id);

  return {
    machine, loading,
    reload,
    update: useCallback(async (data: IUpdateMachine) => {
      const mch = await put(data);
      update(mch);

      return mch;
    }, [put, update])
  };
}
