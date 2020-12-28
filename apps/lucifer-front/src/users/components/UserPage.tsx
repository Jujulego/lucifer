import React, { useRef, useState } from 'react';
import { useParams, useRouteMatch } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';

import { Paper, Tab, Tabs } from '@material-ui/core';

import { useNeedScope } from '../../auth/auth.hooks';
import MachineTable from '../../machines/components/MachineTable';

import { useUser } from '../users.hooks';
import UserDetailsTab from './UserDetailsTab';
import UserHeader from './UserHeader';

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

// Component
interface UserParams {
  id: string;
  page: string;
}

const UserPage = () => {
  // Router
  const { id, page = 'details' } = useParams<UserParams>();

  // Auth
  const canReadMachines = useNeedScope('read:machines', usr => usr?.id === id) ?? false;

  // API
  const { user, loading, reload, put } = useUser(id);

  // Refs
  const actionsContainer = useRef<HTMLSpanElement>(null);

  // Render
  return (
    <>
      <Paper square>
        <UserHeader
          user={user} loading={loading}
          onReload={reload}
          actions={(
            <span ref={actionsContainer} />
          )}
        />
        <Tabs variant="fullWidth" value={page} onChange={() => null}>
          <LinkTab value="details" label="Détails" />
          <LinkTab value="machines" label="Machines" disabled={!canReadMachines} />
        </Tabs>
      </Paper>
      <UserDetailsTab
        user={user} show={page === 'details'}
        onUpdate={put}
      />
      { (page === 'machines') && (
        <MachineTable
          ownerId={id}
          actionsContainer={actionsContainer.current}
        />
      ) }
    </>
  );
};

export default UserPage;
