import React, { FC } from 'react';

import { Fade, TableCell, TableContainer, TableHead } from '@material-ui/core';

import { RefreshButton } from '@lucifer/react-basics';
import { Table, TableBody, TableRow, TableSortCell } from '@lucifer/react-table';
import { IApiKey } from '@lucifer/types';

import { PageActions } from '../../layout/PageActions';
import { usePageTab } from '../../layout/page-tab.context';

import { useApiKeys } from './api-keys.hooks';

// Types
export interface ApiKeysTableProps {
  projectId: string;
}

// Component
export const ApiKeysTable: FC<ApiKeysTableProps> = (props) => {
  const { projectId } = props;

  // Context
  const { open } = usePageTab();

  // API
  const { apiKeys = [], loading, reload } = useApiKeys(projectId);

  // Render
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
        </TableContainer>
      ) }
    </>
  );
};
