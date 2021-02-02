import React, { FC, useCallback, useState } from 'react';

import {
  DialogContent,
  DialogTitle,
  Fab,
  Fade,
  IconButton, List, ListItem, ListItemText,
  makeStyles,
  TableCell,
  TableContainer,
  TableHead,
  Zoom
} from '@material-ui/core';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';

import { ConfirmDialog, RefreshButton, useConfirm } from '@lucifer/react/basics';
import { Table, TableAction, TableBody, TableRow, TableSortCell } from '@lucifer/react/table';
import { IVariable } from '@lucifer/types';

import { useNeedRole } from '../../auth/auth.hooks';
import { PageActions } from '../../layout/PageActions';
import { usePageTab } from '../../layout/page-tab.context';

import { useVariables } from './variables.hooks';
import { AddVariableDialog } from './AddVariableDialog';
import { UpdateVariableDialog } from './UpdateVariableDialog';

// Types
export interface VariablesTableProps {
  adminId: string;
  projectId: string;
}

// Styles
const useStyles = makeStyles(({ spacing }) => ({
  actions: {
    width: 0,
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
export const VariablesTable: FC<VariablesTableProps> = (props) => {
  const { adminId, projectId } = props;

  // Context
  const { open } = usePageTab();

  // State
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState<IVariable | undefined>();
  const { state: deleteState, confirm: confirmDelete } = useConfirm<IVariable[]>([]);

  // Auth
  const isAdmin = useNeedRole('admin', usr => usr?.id === adminId) ?? false;

  // API
  const { variables = [], create, loading, reload, updateCache, bulkDelete } = useVariables(adminId, projectId);

  // Callbacks
  const handleUpdated = useCallback((vrb: IVariable) => {
    updateCache((old = []) => old.map(v => v.id === vrb.id ? vrb : v))
  }, [updateCache]);

  const handleDelete = useCallback(async (variables: IVariable[]) => {
    const ids = variables.map(vrb => vrb.id);

    if (await confirmDelete(variables)) {
      await bulkDelete(ids);
    }
  }, [bulkDelete, confirmDelete]);

  // Render
  const styles = useStyles();

  const toolbar = (
    <PageActions>
      <TableAction when="some" onActivate={handleDelete}>
        <DeleteIcon />
      </TableAction>
      <Fade in={open}>
        <RefreshButton refreshing={loading} onClick={reload} />
      </Fade>
    </PageActions>
  );

  return (
    <>
      { open && (
        <TableContainer>
          <Table documents={variables} toolbar={toolbar}>
            <TableHead>
              <TableRow>
                <TableSortCell<IVariable> field="name">Nom</TableSortCell>
                <TableCell>Value</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              { (vrb: IVariable) => (
                <TableRow key={vrb.id} doc={vrb}>
                  <TableCell>{ vrb.name }</TableCell>
                  <TableCell>{ vrb.value }</TableCell>
                  <TableCell className={styles.actions} onClick={event => event.stopPropagation()}>
                    <IconButton onClick={() => setUpdating(vrb)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ) }
            </TableBody>
          </Table>
          <AddVariableDialog
            open={isAdmin && creating}
            onAdd={create}
            onClose={() => setCreating(false)}
          />
          <UpdateVariableDialog
            open={isAdmin && !!updating}
            variable={updating}
            onUpdated={handleUpdated}
            onClose={() => setUpdating(undefined)}
          />
          <ConfirmDialog state={deleteState}>
            { (variables) => (
              <>
                <DialogTitle>Supprimer { variables.length } variables ?</DialogTitle>
                <DialogContent className={styles.confirmContent} dividers>
                  <List>
                    { variables.map((vrb) => (
                      <ListItem key={vrb.id}>
                        <ListItemText primary={vrb.name} secondary={vrb.id} />
                      </ListItem>
                    )) }
                  </List>
                </DialogContent>
              </>
            ) }
          </ConfirmDialog>
        </TableContainer>
      ) }
      { isAdmin && (
        <Zoom in={open}>
          <Fab
            className={styles.fab} color="primary"
            onClick={() => setCreating(true)}
          >
            <AddIcon />
          </Fab>
        </Zoom>
      ) }
    </>
  );
};
