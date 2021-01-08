import { useCallback } from 'react';

import { IUpdateUser, IUser } from '@lucifer/types';
import { useAPI } from '@lucifer/react/api';

import { env } from '../environments/environment';

// Namespace
export const useUsersAPI = {
  all: () => useAPI.get<IUser[]>(`${env.apiUrl}/api/users`),

  get: (id: string) => useAPI.get<IUser>(`${env.apiUrl}/api/users/${id}`),
  put: (id: string) => useAPI.put<IUpdateUser, IUser>(`${env.apiUrl}/api/users/${id}`)
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
    reload, updateCache: update,
    put: useCallback(async (data: IUpdateUser) => {
      const result = await put(data);
      update(result);

      return result;
    }, [put, update])
  }
}
