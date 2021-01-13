import { useCallback } from 'react';

import { useAPI } from '@lucifer/react/api';
import { ICreateProject, IProject, IUpdateProject } from '@lucifer/types';
import { env } from '../environments/environment';

// Namespace
export const useProjectsAPI = {
  all: (adminId: string) => useAPI.get<IProject[]>(`${env.apiUrl}/api/${adminId}/projects`),
  create: (adminId: string) => useAPI.post<ICreateProject, IProject>(`${env.apiUrl}/api/${adminId}/projects`),
  bulkDelete: (adminId: string) => useAPI.delete<number | null>(`${env.apiUrl}/api/${adminId}/projects`),

  get: (adminId: string, id: string) => useAPI.get<IProject>(`${env.apiUrl}/api/${adminId}/projects/${id}`),
  put: (adminId: string, id: string) => useAPI.put<IUpdateProject, IProject>(`${env.apiUrl}/api/${adminId}/projects/${id}`),
  delete: (adminId: string, id: string) => useAPI.delete<number | null>(`${env.apiUrl}/api/${adminId}/projects/${id}`),
};

// Hooks
export function useProjects(adminId: string) {
  const { data: projects, loading, reload, update } = useProjectsAPI.all(adminId);
  const { send: create } = useProjectsAPI.create(adminId);
  const { send: bulkDelete } = useProjectsAPI.bulkDelete(adminId);

  return {
    projects, loading, reload,
    updateCache: update,
    create: useCallback(async (data: ICreateProject) => {
      const prj = await create(data);
      update((projects = []) => [...projects, prj]);

      return prj;
    }, [create, update]),
    bulkDelete: useCallback(async (ids: string[]) => {
      const affected = await bulkDelete({ ids });
      update((projects = []) => projects.filter(prj => !ids.includes(prj.id)));

      return affected;
    }, [bulkDelete, update]),
  };
}

export function useProject(adminId: string, id: string) {
  const { data: project, loading, reload, update } = useProjectsAPI.get(adminId, id);
  const { send: put } = useProjectsAPI.put(adminId, id);
  const { send: remove } = useProjectsAPI.delete(adminId, id);

  return {
    project, loading, reload,
    remove,
    update: useCallback(async (data: IUpdateProject) => {
      const prj = await put(data);
      update(prj);

      return prj;
    }, [update, put])
  };
}
