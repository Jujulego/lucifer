import { useCallback } from 'react';

import { APIParams, useAPI } from '@lucifer/react-api';
import { IApiKey, IApiKeyWithKey, ICreateApiKey, IUpdateApiKey } from '@lucifer/types';

// Types
interface IBulkDelete extends APIParams {
  ids: string[];
}

// Namespace
export const useApiKeysAPI = {
  all: (projectId: string) => useAPI.get<IApiKey[]>(`/api/projects/${projectId}/api-keys`),
  create: (projectId: string) => useAPI.post<ICreateApiKey, IApiKeyWithKey>(`/api/projects/${projectId}/api-keys`),
  bulkDelete: (projectId: string) => useAPI.delete<number | null, IBulkDelete>(`/api/projects/${projectId}/api-keys`),

  get: (projectId: string, id: string) => useAPI.get<IApiKey>(`/api/projects/${projectId}/api-keys/${id}`),
  put: (projectId: string, id: string) => useAPI.put<IUpdateApiKey, IApiKey>(`/api/projects/${projectId}/api-keys/${id}`),
  delete: (projectId: string, id: string) => useAPI.delete<number | null>(`/api/projects/${projectId}/api-keys/${id}`),
};

// Hooks
export function useApiKeys(projectId: string) {
  const { data: apiKeys, loading, reload, update } = useApiKeysAPI.all(projectId);
  const { send: create } = useApiKeysAPI.create(projectId);
  const { send: bulkDelete } = useApiKeysAPI.bulkDelete(projectId);

  return {
    apiKeys, loading, reload, updateCache: update,
    create: useCallback(async (data: ICreateApiKey) => {
      const apk = await create(data);
      update((apiKeys = []) => [...apiKeys, apk]);

      return apk;
    }, [create, update]),
    bulkDelete: useCallback(async (ids: string[]) => {
      const affected = await bulkDelete({ ids });
      update((apiKeys = []) => apiKeys.filter(apk => !ids.includes(apk.id)));

      return affected;
    }, [bulkDelete, update])
  };
}
