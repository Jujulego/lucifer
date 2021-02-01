import React, { FC, useState } from 'react';

import { Fab, Fade, makeStyles, TableCell, TableContainer, TableHead, Zoom } from '@material-ui/core';
import { Add as AddIcon, Delete as DeleteIcon } from '@material-ui/icons';
import { RefreshButton } from '@lucifer/react/basics';
import { Table, TableAction, TableBody, TableRow, TableSortCell } from '@lucifer/react/table';
import { IVariable } from '@lucifer/types';

import { useNeedRole } from '../../auth/auth.hooks';
import { PageActions } from '../../layout/PageActions';
import { usePageTab } from '../../layout/page-tab.context';

import { useVariables } from './variables.hooks';
import { AddVariableDialog } from './AddVariableDialog';

// Types
export interface VariablesTableProps {
  adminId: string;
  projectId: string;
}

// Styles
const useStyles = makeStyles(({ spacing }) => ({
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

  // Auth
  const isAdmin = useNeedRole('admin', usr => usr?.id === adminId) ?? false;

  // API
  const { variables = [], create, loading, reload } = useVariables(adminId, projectId);

  // Render
  const styles = useStyles();

  const toolbar = (
    <PageActions>
      <TableAction when="some">
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
              </TableRow>
            </TableHead>
            <TableBody>
              { (vrb: IVariable) => (
                <TableRow key={vrb.id} doc={vrb}>
                  <TableCell>{ vrb.name }</TableCell>
                  <TableCell>{ vrb.value }</TableCell>
                </TableRow>
              ) }
            </TableBody>
          </Table>
          <AddVariableDialog
            open={isAdmin && creating}
            onAdd={create}
            onClose={() => setCreating(false)}
          />
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
