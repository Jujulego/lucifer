import { useCallback } from 'react';

import { useAPI } from '@lucifer/react-api';
import { ICreateProject, IProject, IProjectFilters, IUpdateProject } from '@lucifer/types';

// Namespace
export const useProjectsAPI = {
  all: (filters?: IProjectFilters) => useAPI.get<IProject[], IProjectFilters>(`/api/projects`, filters),
  create: () => useAPI.post<ICreateProject, IProject>(`/api/projects`),
  bulkDelete: () => useAPI.delete<number | null>(`/api/projects`),

  get: (id: string) => useAPI.get<IProject>(`/api/projects/${id}`),
  put: (id: string) => useAPI.put<IUpdateProject, IProject>(`/api/projects/${id}`),
  delete: (id: string) => useAPI.delete<number | null>(`/api/projects/${id}`),
};

// Hooks
export function useProjects(filters?: IProjectFilters) {
  const { data: projects, loading, reload, update } = useProjectsAPI.all(filters);
  const { send: create } = useProjectsAPI.create();
  const { send: bulkDelete } = useProjectsAPI.bulkDelete();

  return {
    projects, loading, reload,
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

export function useProject(id: string) {
  const { data: project, loading, reload, update } = useProjectsAPI.get(id);
  const { send: put } = useProjectsAPI.put(id);
  const { send: remove } = useProjectsAPI.delete(id);

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
