import React, { FC, useCallback, useRef, useState } from 'react';

import {
  IconButton,
  Portal,
  TableCell,
  TableContainer,
  TableHead,
  makeStyles,
  Fade,
  Typography, DialogTitle, DialogContent, List, ListItem, ListItemText
} from '@material-ui/core';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';

import { ConfirmDialog, ToolbarAction, useConfirm } from '@lucifer/react/basics';
import { Table, TableBody, TableRow, TableSortCell } from '@lucifer/react/table';
import { IMachine, Machine } from '@lucifer/types';

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
  actions: {
    padding: 0,
    textAlign: 'right'
  },
  confirmContent: {
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
  const { state: deleteState, confirm: confirmDelete } = useConfirm<IMachine[]>([]);

  // Ref
  const selection = useRef<Machine[]>([]);

  // Auth
  const canCreate = useNeedScope('create:machines', usr => usr?.id === ownerId) ?? false;
  const canUpdate = useNeedScope('update:machines', usr => usr?.id === ownerId) ?? false;
  const canDelete = useNeedScope('delete:machines', usr => usr?.id === ownerId) ?? false;

  // API
  const { machines = [], create, updateCache, bulkDelete } = useMachines(ownerId);

  // Callbacks
  const handleSave = useCallback((mch: IMachine) => {
    updateCache((machines = []) => machines.map(m => m.id === mch.id ? mch : m));
  }, [updateCache]);

  const handleDelete = useCallback(async (mchs: IMachine[]) => {
    const ids = mchs.map(mch => mch.id);

    await confirmDelete(mchs);
    await bulkDelete(ids);
    updateCache((machines = []) => machines.filter(mch => ids.includes(mch.id)));
  }, [bulkDelete, confirmDelete, updateCache]);

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
            tooltip="Supprimer une machine" disabled={!canDelete}
            onClick={() => handleDelete(selection.current)}
          >
            <DeleteIcon />
          </ToolbarAction>
        </Fade>
      </Portal>
      <TableContainer>
        <Table id="machines-table" documents={machines} selectionRef={selection}>
          <TableHead>
            <TableRow>
              <TableSortCell<IMachine> field="shortName">Nom</TableSortCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            { (mch: IMachine) => (
              <TableRow key={mch.id} doc={mch}>
                <TableCell>
                  { mch.shortName }
                </TableCell>
                <TableCell className={styles.actions} onClick={event => event.stopPropagation()}>
                  <IconButton disabled={!canUpdate} onClick={() => setUpdateMachine(mch)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton disabled={!canDelete} onClick={() => handleDelete([mch])}>
                    <DeleteIcon />
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
      <ConfirmDialog state={deleteState}>
        { (mchs) => (
          <>
            <DialogTitle>Supprimer { mchs.length } machines ?</DialogTitle>
            <DialogContent className={styles.confirmContent} dividers>
              <List>
                { mchs.map((mch) => (
                  <ListItem key={mch.id}>
                    <ListItemText primary={mch.shortName} secondary={mch.id} />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
          </>
        ) }
      </ConfirmDialog>
    </>
  );
};

export default MachineTable;
