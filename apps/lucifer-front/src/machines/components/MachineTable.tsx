import React, { FC, useCallback, useState } from 'react';

import { IconButton, Portal, TableCell, TableContainer, TableHead, makeStyles, Fade } from '@material-ui/core';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';

import { ToolbarAction } from '@lucifer/react/basics';
import { Table, TableBody, TableRow, TableSortCell } from '@lucifer/react/table';
import { IMachine } from '@lucifer/types';

import { useNeedScope } from '../../auth/auth.hooks';

import { useMachines } from '../machine.hooks';
import AddMachineDialog from './AddMachineDialog';
import MachineDialog from './MachineDialog';

// Types
export interface MachineTableProps {
  ownerId: string;
  actionsContainer: HTMLElement | null;
}

// Styles
const useStyles = makeStyles({
  noPadding: {
    padding: 0,
  }
});

// Component
const MachineTable: FC<MachineTableProps> = (props) => {
  // Props
  const { ownerId, actionsContainer } = props;

  // State
  const [addingMachine, setAddingMachine] = useState(false);
  const [updateMachine, setUpdateMachine] = useState<IMachine | null>(null);

  // Auth
  const canCreate = useNeedScope('create:machines', usr => usr?.id === ownerId) ?? false;
  const canDelete = useNeedScope('delete:machines', usr => usr?.id === ownerId) ?? false;

  // API
  const { machines = [], create, updateCache } = useMachines(ownerId);

  // Callbacks
  const handleSave = useCallback((mch: IMachine) => {
    updateCache((machines = []) => machines.map(m => m.id === mch.id ? mch : m));
  }, [updateCache]);

  // Render
  const styles = useStyles();

  return (
    <>
      <Portal container={actionsContainer}>
        <Fade in appear>
          <ToolbarAction
            tooltip="Créer une machine" disabled={!canCreate}
            onClick={() => setAddingMachine(true)}
          >
            <AddIcon />
          </ToolbarAction>
        </Fade>
        <Fade in appear>
          <ToolbarAction
            tooltip="Supprimer une machine" disabled
          >
            <DeleteIcon />
          </ToolbarAction>
        </Fade>
      </Portal>
      <TableContainer>
        <Table id="machines-table" documents={machines}>
          <TableHead>
            <TableRow>
              <TableSortCell<IMachine> field="shortName">Nom</TableSortCell>
              <TableCell>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { (mch: IMachine) => (
              <TableRow key={mch.id} doc={mch}>
                <TableCell>
                  { mch.shortName }
                </TableCell>
                <TableCell className={styles.noPadding} onClick={event => event.stopPropagation()}>
                  <IconButton onClick={() => setUpdateMachine(mch)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ) }
          </TableBody>
        </Table>
      </TableContainer>
      <AddMachineDialog
        open={addingMachine && canCreate}
        onAdd={create}
        onClose={() => setAddingMachine(false)}
      />
      <MachineDialog
        machine={updateMachine}
        onSave={handleSave}
        onClose={() => setUpdateMachine(null)}
      />
    </>
  );
};

export default MachineTable;
