import React, { useRef } from 'react';
import { useParams } from 'react-router';

import { Fade, Paper, Tabs, makeStyles } from '@material-ui/core';

import { LinkTab, RefreshButton } from '@lucifer/react/basics';

import { useNeedRole } from '../auth/auth.hooks';
import MachineTable from '../machines/components/MachineTable';

import { useUser } from './users.hooks';
import { UserDetailsTab } from './UserDetailsTab';
import { UserHeader } from './UserHeader';
import { ProjectsTable } from '../projects/ProjectsTable';

// Types
interface UserParams {
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
export const UserPage = () => {
  // Router
  const { id, page = 'details' } = useParams<UserParams>();

  // Auth
  const isAllowed = useNeedRole(['admin', 'reader'], usr => usr?.id === id) ?? false;

  // API
  const { user, loading, reload, put } = useUser(id);

  // Refs
  const actionsContainer = useRef<HTMLDivElement>(null);

  // Render
  const styles = useStyles();

  return (
    <>
      <Paper square>
        <UserHeader
          user={user}
          actions={(
            <div className={styles.toolbar} ref={actionsContainer}>
              <span>
                <Fade in={page === 'details'}>
                  <RefreshButton refreshing={loading} onClick={reload} />
                </Fade>
              </span>
            </div>
          )}
        />
        <Tabs variant="fullWidth" value={page} onChange={() => null}>
          <LinkTab routeParameter="page" value="details" label="Détails" />
          <LinkTab routeParameter="page" value="machines" label="Machines" disabled={!isAllowed} />
          <LinkTab routeParameter="page" value="projects" label="Projects" disabled={!isAllowed} />
        </Tabs>
      </Paper>
      <UserDetailsTab
        user={user} show={page === 'details'}
        onUpdate={put}
      />
      <MachineTable
        ownerId={id} show={page === 'machines'}
        actionsContainer={actionsContainer.current}
      />
      <ProjectsTable
        adminId={id} show={page === 'projects'}
        actionsContainer={actionsContainer.current}
      />
    </>
  );
};
