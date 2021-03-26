import React, { FC, useCallback, useMemo, useState } from 'react';

import {
  DialogContent,
  DialogTitle,
  Fab,
  Fade, IconButton, List, ListItem, ListItemText,
  makeStyles,
  TableCell,
  TableContainer,
  TableHead,
  Zoom
} from '@material-ui/core';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';

import { ConfirmDialog, RefreshButton, useConfirm } from '@lucifer/react-basics';
import { Table, TableAction, TableBody, TableRow, TableSortCell } from '@lucifer/react-table';
import { IApiKey, IApiKeyWithKey } from '@lucifer/types';

import { PageActions } from '../../layout/PageActions';
import { usePageTab } from '../../layout/page-tab.context';

import { useApiKeys } from './api-keys.hooks';
import { AddApiKeyDialog } from './AddApiKeyDialog';
import { UpdateApiKeyDialog } from './UpdateApiKeyDialog';

// Types
export interface ApiKeysTableProps {
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
export const ApiKeysTable: FC<ApiKeysTableProps> = (props) => {
  const { projectId } = props;

  // Context
  const { open } = usePageTab();

  // State
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState<IApiKey | undefined>();
  const { state: deleteState, confirm: confirmDelete } = useConfirm<IApiKey[]>([]);

  // API
  const { apiKeys = [], create, loading, reload, updateCache, bulkDelete } = useApiKeys(projectId);

  // Callbacks
  const handleUpdated = useCallback(async (apk: IApiKey) => {
    updateCache((old = []) => old.map(a => a.id === apk.id ? apk : a));
  }, [updateCache]);

  const handleDelete = useCallback(async (apiKeys: IApiKey[]) => {
    const ids = apiKeys.map(apk => apk.id);

    if (await confirmDelete(apiKeys)) {
      await bulkDelete(ids);
    }
  }, [bulkDelete, confirmDelete]);

  // Memo
  const asKey = useMemo(() => apiKeys.some(apk => 'key' in apk), [apiKeys]);

  // Render
  const styles = useStyles();

  const toolbar = (
    <PageActions>
      <TableAction when="some" aria-label="delete variables" onActivate={handleDelete}>
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
          <Table documents={apiKeys} toolbar={toolbar}>
            <TableHead>
              <TableRow>
                <TableSortCell<IApiKey> field="label">Label</TableSortCell>
                <TableSortCell<IApiKey> field="id">Identifiant</TableSortCell>
                { asKey && <TableCell>Clé</TableCell> }
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              { (apk: IApiKey) => (
                <TableRow key={apk.id} doc={apk} hover>
                  <TableCell>{ apk.label }</TableCell>
                  <TableCell>{ apk.id }</TableCell>
                  { asKey && <TableCell>{ (apk as IApiKeyWithKey).key }</TableCell> }
                  <TableCell className={styles.actions} onClick={event => event.stopPropagation()}>
                    <IconButton onClick={() => setUpdating(apk)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ) }
            </TableBody>
          </Table>
          <AddApiKeyDialog
            open={creating}
            onAdd={create}
            onClose={() => setCreating(false)}
          />
          <UpdateApiKeyDialog
            open={!!updating}
            apiKey={updating}
            onUpdated={handleUpdated}
            onClose={() => setUpdating(undefined)}
          />
          <ConfirmDialog state={deleteState}>
            { (apiKeys: IApiKey[]) => (
              <>
                <DialogTitle>Supprimer { apiKeys.length } clé d'APIs ?</DialogTitle>
                <DialogContent className={styles.confirmContent} dividers>
                  <List>
                    { apiKeys.map((apk) => (
                      <ListItem key={apk.id}>
                        <ListItemText primary={apk.label} secondary={apk.id} />
                      </ListItem>
                    )) }
                  </List>
                </DialogContent>
              </>
            ) }
          </ConfirmDialog>
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
