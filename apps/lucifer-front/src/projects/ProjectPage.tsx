import React, { FC, useCallback, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import { Delete as DeleteIcon } from '@material-ui/icons';
import { RefreshButton, ToolbarAction } from '@lucifer/react/basics';

import { useNeedRole } from '../auth/auth.hooks';

import { useProject } from './projects.hooks';
import { ProjectHeader } from './ProjectHeader';
import { ProjectDetailsTab } from './ProjectDetailsTab';
import { VariablesTable } from './variables/VariablesTable';
import { PageLayout } from '../layout/PageLayout';
import { PageToolbar } from '../layout/PageToolbar';
import { PageHeader } from '../layout/PageHeader';
import { PageTab } from '../layout/PageTab';
import { Fade } from '@material-ui/core';

// Types
interface ProjectParams {
  userId: string;
  id: string;
  page: string;
}

// Component
export const ProjectPage: FC = () => {
  // Router
  const history = useHistory();
  const { userId, id, page } = useParams<ProjectParams>();

  // API
  const { project, loading, reload, update, remove } = useProject(id);

  // Auth
  const isAdmin = useNeedRole('admin'/*, usr => project?.adminId === usr?.id*/) ?? false;

  // State
  const [isRemoving, setRemoving] = useState(false);

  // Callbacks
  const handleDelete = useCallback(async () => {
    setRemoving(true);
    await remove();
    history.goBack();
  }, [remove, history]);

  // Render
  return (
    <PageLayout defaultTab="details" routeParameter="page">
      <PageHeader>
        <ProjectHeader
          project={project}
          actions={(
            <PageToolbar>
              <Fade in={page === 'details'}>
                <ToolbarAction disabled={!isAdmin || isRemoving} tooltip="Supprimer le projet" onClick={handleDelete}>
                  <DeleteIcon />
                </ToolbarAction>
              </Fade>
              { (page === 'details') && (
                <RefreshButton disabled={isRemoving} refreshing={loading} onClick={reload} />
              ) }
            </PageToolbar>
          )}
        />
      </PageHeader>
      <PageTab value="details" label="Détails" keepMounted>
        <ProjectDetailsTab project={project} isRemoving={isRemoving} onUpdate={update} />
      </PageTab>
      <PageTab value="variables" label="Variables" keepMounted>
        <VariablesTable adminId={userId} projectId={id} />
      </PageTab>
    </PageLayout>
  );
};
