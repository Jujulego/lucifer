import React, { FC, useState } from 'react';

import { Fab, Fade, makeStyles, TableCell, TableContainer, TableHead, Zoom } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';

import { RefreshButton } from '@lucifer/react-basics';
import { Table, TableBody, TableRow, TableSortCell } from '@lucifer/react-table';
import { IApiKey } from '@lucifer/types';

import { PageActions } from '../../layout/PageActions';
import { usePageTab } from '../../layout/page-tab.context';

import { useApiKeys } from './api-keys.hooks';
import { AddApiKeyDialog } from './AddApiKeyDialog';

// Types
export interface ApiKeysTableProps {
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
export const ApiKeysTable: FC<ApiKeysTableProps> = (props) => {
  const { projectId } = props;

  // Context
  const { open } = usePageTab();

  // State
  const [creating, setCreating] = useState(false);

  // API
  const { apiKeys = [], create, loading, reload } = useApiKeys(projectId);

  // Render
  const styles = useStyles();

  const toolbar = (
    <PageActions>
      <Fade in={open}>
        <RefreshButton refreshing={loading} onClick={reload} />
      </Fade>
    </PageActions>
  );

  return (
    <>
      { open && (
        <TableContainer>
          <Table documents={apiKeys} toolbar={toolbar}>
            <TableHead>
              <TableRow>
                <TableSortCell<IApiKey> field="id">Identifiant</TableSortCell>
                <TableSortCell<IApiKey> field="label">Label</TableSortCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { (apk: IApiKey) => (
                <TableRow key={apk.id} doc={apk}>
                  <TableCell>{ apk.id }</TableCell>
                  <TableCell>{ apk.label }</TableCell>
                </TableRow>
              ) }
            </TableBody>
          </Table>
          <AddApiKeyDialog
            open={creating}
            onAdd={create}
            onClose={() => setCreating(false)}
          />
        </TableContainer>
      ) }
      <Zoom in={open}>
        <Fab
          className={styles.fab} color="primary"
          aria-label="add api-key"
          onClick={() => setCreating(true)}
        >
          <AddIcon />
        </Fab>
      </Zoom>
    </>
  );
};
