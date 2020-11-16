import { useCallback } from 'react';

import useAPI from 'src/basics/api.hooks';

import { UpdateUser, User } from './models/user';

// Namespace
export const useUsersAPI = {
  all: () => useAPI.get<User[]>('/api/users'),

  get: (id: string) => useAPI.get<User>(`/api/users/${id}`),
  put: (id: string) => useAPI.put<UpdateUser, User>(`/api/users/${id}`)
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
