import { useCallback } from 'react';

import { APIParams, useAPI } from '@lucifer/react-api';
import { ICreateVariable, IUpdateVariable, IVariable } from '@lucifer/types';

// Types
interface IBulkDelete extends APIParams {
  ids: string[];
}

// Namespace
export const useVariablesAPI = {
  all: (projectId: string) => useAPI.get<IVariable[]>(`/api/projects/${projectId}/variables`),
  create: (projectId: string) => useAPI.post<ICreateVariable, IVariable>(`/api/projects/${projectId}/variables`),
  bulkDelete: (projectId: string) => useAPI.delete<number | null, IBulkDelete>(`/api/projects/${projectId}/variables`),

  get: (projectId: string, id: string) => useAPI.get<IVariable>(`/api/projects/${projectId}/variables/${id}`),
  put: (projectId: string, id: string) => useAPI.put<IUpdateVariable, IVariable>(`/api/projects/${projectId}/variables/${id}`),
  delete: (projectId: string, id: string) => useAPI.delete<number | null>(`/api/projects/${projectId}/variables/${id}`),
};

// Hooks
export function useVariables(projectId: string) {
  const { data: variables, loading, reload, update } = useVariablesAPI.all(projectId);
  const { send: create } = useVariablesAPI.create(projectId);
  const { send: bulkDelete } = useVariablesAPI.bulkDelete(projectId);

  return {
    variables, loading, reload, updateCache: update,
    create: useCallback(async (data: ICreateVariable) => {
      const vrb = await create(data);
      update((variables = []) => [...variables, vrb]);

      return vrb;
    }, [create, update]),
    bulkDelete: useCallback(async (ids: string[]) => {
      const affected = await bulkDelete({ ids });
      update((variables = []) => variables.filter(vrb => !ids.includes(vrb.id)));

      return affected;
    }, [bulkDelete, update])
  };
}

