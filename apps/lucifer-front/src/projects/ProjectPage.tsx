import React, { FC, useCallback, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import { Paper, Tabs } from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { LinkTab, RefreshButton, ToolbarAction } from '@lucifer/react/basics';

import { useNeedRole } from '../auth/auth.hooks';

import { useProject } from './projects.hooks';
import { ProjectHeader } from './ProjectHeader';
import { ProjectDetailsTab } from './ProjectDetailsTab';
import { VariablesTable } from './variables/VariablesTable';
import { PageLayout } from '../layout/PageLayout';
import { PageToolbar } from '../layout/PageToolbar';

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
  const { userId, id, page = "details" } = useParams<ProjectParams>();

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
    <PageLayout>
      <Paper square>
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
        <Tabs variant="fullWidth" value={page} onChange={() => null}>
          <LinkTab routeParameter="page" value="details" label="Détails" />
          <LinkTab routeParameter="page" value="variables" label="Variables" />
        </Tabs>
      </Paper>
      <ProjectDetailsTab
        project={project} show={page === "details"} isRemoving={isRemoving}
        onUpdate={update}
      />
      <VariablesTable
        adminId={userId} projectId={id} show={page === "variables"}
      />
    </PageLayout>
  );
};
