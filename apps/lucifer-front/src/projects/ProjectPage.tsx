import React, { FC } from 'react';
import { useParams } from 'react-router';
import { useProject } from './projects.hooks';

// Types
interface ProjectParams {
  userId: string;
  id: string;
}

// Component
export const ProjectPage: FC = () => {
  // Router
  const { userId, id } = useParams<ProjectParams>();

  // API
  const { project } = useProject(userId, id);

  // Render
  return (
    <span>{ project?.name }</span>
  );
};
