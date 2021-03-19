import React from 'react';
import { useParams } from 'react-router';

import { Fade } from '@material-ui/core';

import { RefreshButton } from '@lucifer/react-basics';

import { useNeedRole } from '../auth/auth.hooks';
import { PageHeader } from '../layout/PageHeader';
import { PageLayout } from '../layout/PageLayout';
import { PageToolbar } from '../layout/PageToolbar';
import { ProjectsTable } from '../projects/ProjectsTable';

import { useUser } from './users.hooks';
import { UserDetailsTab } from './UserDetailsTab';
import { UserHeader } from './UserHeader';
import { PageTab } from '../layout/PageTab';

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
    <PageLayout defaultTab="details" routeParameter="page">
      <PageHeader>
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
      </PageHeader>
      <PageTab label="Détails" value="details" keepMounted>
        <UserDetailsTab user={user} onUpdate={put} />
      </PageTab>
      <PageTab label="Projets" value="projects" keepMounted disabled={!isAllowed}>
        <ProjectsTable adminId={id} inUserPage filters={{ member: id }} />
      </PageTab>
    </PageLayout>
  );
};
