import React, { FC, useCallback, useRef, useState } from 'react';

import {
  Fab, IconButton,
  DialogTitle, DialogContent,
  List, ListItem, ListItemText,
  TableContainer, TableHead, TableCell,
  Fade, Zoom,
  makeStyles
} from '@material-ui/core';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';

import { ConfirmDialog, RefreshButton, ToolbarAction, useConfirm } from '@lucifer/react/basics';
import { Table, TableBody, TableRow, TableSortCell } from '@lucifer/react/table';
import { IMachine } from '@lucifer/types';

import { useNeedRole } from '../../auth/auth.hooks';
import { PageActions } from '../../layout/PageActions';
import { usePageTab } from '../../layout/page-tab.context';

import { useMachines } from '../machine.hooks';
import AddMachineDialog from './AddMachineDialog';
import MachineDialog from './MachineDialog';

// Types
export interface MachineTableProps {
  ownerId: string;
}

// Styles
const useStyles = makeStyles(({ spacing }) => ({
  actions: {
    padding: 0,
    textAlign: 'right'
  },
  confirmContent: {
    padding: 0,
  },
  fab: {
    position: 'absolute',
    bottom: spacing(2),
    right: spacing(2)
  }
}));

// Component
const MachineTable: FC<MachineTableProps> = (props) => {
  const { ownerId } = props;

  // Context
  const { open } = usePageTab();

  // State
  const [addingMachine, setAddingMachine] = useState(false);
  const [updateMachine, setUpdateMachine] = useState<IMachine | null>(null);
  const { state: deleteState, confirm: confirmDelete } = useConfirm<IMachine[]>([]);

  // Ref
  const selection = useRef<IMachine[]>([]);

  // Auth
  const isAdmin = useNeedRole('admin', usr => usr?.id === ownerId) ?? false;

  // API
  const { machines = [], loading, reload, updateCache, create, bulkDelete } = useMachines(ownerId);

  // Callbacks
  const handleSave = useCallback((mch: IMachine) => {
    updateCache((machines = []) => machines.map(m => m.id === mch.id ? mch : m));
  }, [updateCache]);

  const handleDelete = useCallback(async (mchs: IMachine[]) => {
    const ids = mchs.map(mch => mch.id);

    if (await confirmDelete(mchs)) {
      await bulkDelete(ids);
      updateCache((machines = []) => machines.filter(mch => !ids.includes(mch.id)));
    }
  }, [bulkDelete, confirmDelete, updateCache]);

  // Render
  const styles = useStyles();

  return (
    <>
      <PageActions>
        { isAdmin && (
          <Fade in={open}>
            <ToolbarAction
              tooltip="Supprimer une machine" disabled={!isAdmin}
              onClick={() => handleDelete(selection.current)}
            >
              <DeleteIcon />
            </ToolbarAction>
          </Fade>
        ) }
        <Fade in={open}>
          <RefreshButton refreshing={loading} onClick={reload} />
        </Fade>
      </PageActions>
      { open && (
        <>
          <TableContainer>
            <Table documents={machines} selectionRef={selection}>
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
                      { isAdmin && (
                        <IconButton onClick={() => setUpdateMachine(mch)}>
                          <EditIcon />
                        </IconButton>
                      ) }
                      { isAdmin && (
                        <IconButton onClick={() => handleDelete([mch])}>
                          <DeleteIcon />
                        </IconButton>
                      ) }
                    </TableCell>
                  </TableRow>
                ) }
              </TableBody>
            </Table>
          </TableContainer>
          <AddMachineDialog
            open={addingMachine && isAdmin}
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
      ) }
      { isAdmin && (
        <Zoom in={open}>
          <Fab
            className={styles.fab} color="primary"
            onClick={() => setAddingMachine(true)}
          >
            <AddIcon />
          </Fab>
        </Zoom>
      ) }
    </>
  );
};

export default MachineTable;
