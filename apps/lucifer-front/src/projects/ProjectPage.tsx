import React, { FC } from 'react';
import { useParams } from 'react-router';

import { Paper } from '@material-ui/core';

import { useProject } from './projects.hooks';
import { RefreshButton } from '@lucifer/react/basics';
import { ProjectHeader } from './ProjectHeader';

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
  const { project, loading, reload } = useProject(userId, id);

  // Render
  return (
    <Paper square>
      <ProjectHeader
        project={project}
        actions={(
          <RefreshButton refreshing={loading} onClick={reload} />
        )}
      />
    </Paper>
  );
};
