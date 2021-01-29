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

// Types
interface ProjectParams {
  userId: string;
  id: string;
}

// Component
export const ProjectPage: FC = () => {
  // Router
  const history = useHistory();
  const { userId, id} = useParams<ProjectParams>();

  // API
  const { project, loading, reload, update, remove } = useProject(userId, id);

  // Auth
  const isAdmin = useNeedRole('admin', usr => project?.adminId === usr?.id) ?? false;

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
              <ToolbarAction disabled={!isAdmin || isRemoving} tooltip="Supprimer le projet" onClick={handleDelete}>
                <DeleteIcon />
              </ToolbarAction>
              <RefreshButton disabled={isRemoving} refreshing={loading} onClick={reload} />
            </PageToolbar>
          )}
        />
      </PageHeader>
      <PageTab value="details" label="Détails">
        { (show) => (
          <ProjectDetailsTab
            project={project} show={show} isRemoving={isRemoving}
            onUpdate={update}
          />
        ) }
      </PageTab>
      <PageTab value="variables" label="Variables">
        { (show) => (
          <VariablesTable
            adminId={userId} projectId={id} show={show}
          />
        ) }
      </PageTab>
    </PageLayout>
  );
};
