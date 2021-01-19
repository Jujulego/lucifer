import React, { useRef } from 'react';
import { useParams, useRouteMatch } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';

import { Fade, Paper, Tab, Tabs, makeStyles } from '@material-ui/core';

import { RefreshButton } from '@lucifer/react/basics';

import { useNeedRole } from '../auth/auth.hooks';
import MachineTable from '../machines/components/MachineTable';

import { useUser } from './users.hooks';
import { UserDetailsTab } from './UserDetailsTab';
import { UserHeader } from './UserHeader';
import { ProjectsTable } from '../projects/ProjectsTable';

// Utils
interface LinkTabProps {
  value: string;
  label: string;
  disabled?: boolean;
}

const LinkTab = (props: LinkTabProps) => {
  const { value } = props;
  const { url } = useRouteMatch();
  const { page } = useParams<UserParams>();

  return (
    <Tab {...props}
      component={RouterLink}
      to={page ? url.replace(page, value) : `${url}/${value}`}
    />
  );
};

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
          <LinkTab value="details" label="Détails" />
          <LinkTab value="machines" label="Machines" disabled={!isAllowed} />
          <LinkTab value="projects" label="Projects" disabled={!isAllowed} />
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
