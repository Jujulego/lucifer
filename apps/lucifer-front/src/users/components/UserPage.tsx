import React, { useCallback, useState } from 'react';
import { useParams, useRouteMatch } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';

import { Fade, Paper, Tab, Tabs } from '@material-ui/core';

import { useUser } from '../users.hooks';
import UserDetailsTab from './UserDetailsTab';
import UserHeader from './UserHeader';
import MachineTable from '../../machines/components/MachineTable';
import AddMachineDialog from '../../machines/components/AddMachineDialog';
import { useMachines } from '../../machines/machine.hooks';
import { ToolbarAction } from '@lucifer/react/basics';
import { Add as AddIcon } from '@material-ui/icons';
import { useNeedScope } from '../../auth/auth.hooks';

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

  // State
  const [addingMachine, setAddingMachine] = useState(false);

  // Auth
  const canAddMachines = useNeedScope('create:machines', usr => usr?.id === id) ?? false;
  const canReadMachines = useNeedScope('read:machines', usr => usr?.id === id) ?? false;

  // API
  const { user, loading, reload: reloadUser, put } = useUser(id);
  const { machines = [], reload: reloadMachines, create: createMachine } = useMachines(id);

  // Callbacks
  const reload = useCallback(() => {
    reloadUser();
    reloadMachines();
  }, [reloadUser, reloadMachines]);

  // Render
  return (
    <>
      <Paper square>
        <UserHeader
          user={user} loading={loading}
          onReload={reload}
          actions={(
            <Fade in={(page === 'machines') && canAddMachines}>
              <ToolbarAction
                tooltip="Créer une machine" disabled={loading}
                onClick={() => setAddingMachine(true)}
              >
                <AddIcon />
              </ToolbarAction>
            </Fade>
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
        <MachineTable machines={machines} />
      ) }
      <AddMachineDialog
        open={addingMachine && canAddMachines}
        onAdd={createMachine}
        onClose={() => setAddingMachine(false)}
      />
    </>
  );
};

export default UserPage;
