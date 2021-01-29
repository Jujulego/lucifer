import React from 'react';
import { useParams } from 'react-router';

import { Fade, Paper, Tabs } from '@material-ui/core';

import { LinkTab, RefreshButton } from '@lucifer/react/basics';

import { useNeedRole } from '../auth/auth.hooks';
import MachineTable from '../machines/components/MachineTable';

import { useUser } from './users.hooks';
import { UserDetailsTab } from './UserDetailsTab';
import { UserHeader } from './UserHeader';
import { ProjectsTable } from '../projects/ProjectsTable';
import { PageLayout } from '../layout/PageLayout';
import { PageToolbar } from '../layout/PageToolbar';

// Types
interface UserParams {
  id: string;
  page: string;
}

// Component
export const UserPage = () => {
  // Router
  const { id, page = 'details' } = useParams<UserParams>();

  // Auth
  const isAllowed = useNeedRole(['admin', 'reader'], usr => usr?.id === id) ?? false;

  // API
  const { user, loading, reload, put } = useUser(id);

  // Render
  return (
    <PageLayout>
      <Paper square>
        <UserHeader
          user={user}
          actions={(
            <PageToolbar>
              <Fade in={page === 'details'}>
                <RefreshButton refreshing={loading} onClick={reload} />
              </Fade>
            </PageToolbar>
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
      />
      <ProjectsTable
        adminId={id} show={page === 'projects'}
        inUserPage
      />
    </PageLayout>
  );
};
