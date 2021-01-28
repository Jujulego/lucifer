import { useCallback } from 'react';

import { APIParams, useAPI } from '@lucifer/react/api';
import { ICreateVariable, IUpdateVariable, IVariable } from '@lucifer/types';

import { env } from '../../environments/environment';

// Types
interface IBulkDelete extends APIParams {
  ids: string[];
}

// Namespace
export const useVariablesAPI = {
  all: (adminId: string, projectId: string) => useAPI.get<IVariable[]>(`${env.apiUrl}/api/${adminId}/projects/${projectId}/variables`),
  create: (adminId: string, projectId: string) => useAPI.post<ICreateVariable, IVariable>(`${env.apiUrl}/api/${adminId}/projects/${projectId}/variables`),
  bulkDelete: (adminId: string, projectId: string) => useAPI.delete<number | null, IBulkDelete>(`${env.apiUrl}/api/${adminId}/projects/${projectId}/variables`),

  get: (adminId: string, projectId: string, id: string) => useAPI.get<IVariable>(`${env.apiUrl}/api/${adminId}/projects/${projectId}/variables/${id}`),
  put: (adminId: string, projectId: string, id: string) => useAPI.put<IUpdateVariable, IVariable>(`${env.apiUrl}/api/${adminId}/projects/${projectId}/variables/${id}`),
  delete: (adminId: string, projectId: string, id: string) => useAPI.delete<IVariable>(`${env.apiUrl}/api/${adminId}/projects/${projectId}/variables/${id}`),
};

// Hooks
export function useVariables(adminId: string, projectId: string) {
  const { data: variables, loading, reload, update } = useVariablesAPI.all(adminId, projectId);
  const { send: create } = useVariablesAPI.create(adminId, projectId);
  const { send: bulkDelete } = useVariablesAPI.bulkDelete(adminId, projectId);

  return {
    variables, loading, reload,
    create: useCallback(async (data: ICreateVariable) => {
      const vrb = await create(data);
      update((variables = []) => [...variables, vrb]);

      return vrb;
    }, [create, update]),
    bulkDelete: useCallback(async (ids: string[]) => {
      const affected = await bulkDelete({ ids });
      update((variables = []) => variables.filter(vrb => ids.includes(vrb.id)));

      return affected;
    }, [bulkDelete, update])
  };
}

