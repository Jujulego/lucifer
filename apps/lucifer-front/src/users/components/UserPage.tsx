import React from 'react';
import { useParams, useRouteMatch } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';

import { Paper, Tab, Tabs } from '@material-ui/core';

import { useUser } from '../users.hooks';
import UserDetailsTab from './UserDetailsTab';
import UserHeader from './UserHeader';

// Utils
interface LinkTabProps {
  value: string;
  label: string;
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

// Component
interface UserParams {
  id: string;
  page: string;
}

const UserPage = () => {
  // Router
  const { id, page = 'details' } = useParams<UserParams>();

  // API
  const { user, loading, reload, put } = useUser(id);

  // Render
  return (
    <>
      <Paper square>
        <UserHeader
          user={user} loading={loading}
          onReload={reload}
        />
        <Tabs variant="fullWidth" value={page} onChange={() => null}>
          <LinkTab value="details" label="Détails" />
        </Tabs>
      </Paper>
      <UserDetailsTab
        user={user} show={page === 'details'}
        onUpdate={put}
      />
    </>
  );
};

export default UserPage;
