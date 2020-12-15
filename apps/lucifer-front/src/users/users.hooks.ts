import { useCallback } from 'react';

import { IUser } from '@lucifer/types';
import { useAPI } from '@lucifer/react/api';

import { UpdateUser } from './models/user';

// Namespace
export const useUsersAPI = {
  all: () => useAPI.get<IUser[]>('/api/users'),

  get: (id: string) => useAPI.get<IUser>(`/api/users/${id}`),
  put: (id: string) => useAPI.put<UpdateUser, IUser>(`/api/users/${id}`)
};

// Hooks
export function useUsers() {
  const { data: users, loading, reload } = useUsersAPI.all();

  return {
    users, loading,
    reload
  };
}

export function useUser(id: string) {
  const { data: user, loading, reload, update } = useUsersAPI.get(id);
  const { send: put } = useUsersAPI.put(id);

  return {
    user, loading,
    reload, update,
    put: useCallback(async (data: UpdateUser) => {
      const result = await put(data);
      update(result);

      return result;
    }, [put, update])
  }
}