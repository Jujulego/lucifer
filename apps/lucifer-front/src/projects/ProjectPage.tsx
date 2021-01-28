import React, { FC, useCallback, useRef, useState } from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router';

import { Paper, Tab, Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { RefreshButton, ToolbarAction } from '@lucifer/react/basics';

import { useNeedRole } from '../auth/auth.hooks';

import { useProject } from './projects.hooks';
import { ProjectHeader } from './ProjectHeader';
import { Link as RouterLink } from 'react-router-dom';
import { ProjectDetailsTab } from './ProjectDetailsTab';
import { VariablesTable } from './variables/VariablesTable';

// Utils
interface LinkTabProps {
  value: string;
  label: string;
  disabled?: boolean;
}

const LinkTab = (props: LinkTabProps) => {
  const { value } = props;
  const { url } = useRouteMatch();
  const { page } = useParams<ProjectParams>();

  return (
    <Tab {...props}
      component={RouterLink}
      to={page ? url.replace(page, value) : `${url}/${value}`}
    />
  );
};

// Types
interface ProjectParams {
  userId: string;
  id: string;
  page: string;
}

// Styles
const useStyles = makeStyles({
  toolbar: {
    display: 'grid',
    justifyItems: 'end',

    '& > *': {
      gridArea: '1 / 1 / 2 / 2',
    }
  }
});

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

  // Refs
  const actionsContainer = useRef<HTMLDivElement>(null);

  // Render
  const styles = useStyles();

  return (
    <>
      <Paper square>
        <ProjectHeader
          project={project}
          actions={(
            <div className={styles.toolbar} ref={actionsContainer}>
              <span>
                <ToolbarAction disabled={!isAdmin || isRemoving} tooltip="Supprimer le projet" onClick={handleDelete}>
                  <DeleteIcon />
                </ToolbarAction>
                <RefreshButton disabled={isRemoving} refreshing={loading} onClick={reload} />
              </span>
            </div>
          )}
        />
        <Tabs variant="fullWidth" value={page} onChange={() => null}>
          <LinkTab value="details" label="Détails" />
          <LinkTab value="variables" label="Variables" />
        </Tabs>
      </Paper>
      <ProjectDetailsTab
        project={project} show={page === "details"} isRemoving={isRemoving}
        onUpdate={update}
      />
      <VariablesTable
        adminId={userId} projectId={id} show={page === "variables"}
        actionsContainer={actionsContainer.current}
      />
    </>
  );
};
