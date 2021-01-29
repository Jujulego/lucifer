import React, { FC } from 'react';

import { Fade, TableCell, TableContainer, TableHead } from '@material-ui/core';
import { RefreshButton } from '@lucifer/react/basics';
import { Table, TableBody, TableRow, TableSortCell } from '@lucifer/react/table';
import { IVariable } from '@lucifer/types';

import { useVariables } from './variables.hooks';
import { PageActions } from '../../layout/PageActions';

// Types
export interface VariablesTableProps {
  adminId: string;
  projectId: string;
  show?: boolean;
}

// Component
export const VariablesTable: FC<VariablesTableProps> = (props) => {
  // Props
  const { adminId, show = true, projectId } = props;

  // API
  const { variables = [], loading, reload } = useVariables(adminId, projectId);

  // Render
  return (
    <>
      <PageActions>
        <Fade in={show}>
          <RefreshButton refreshing={loading} onClick={reload} />
        </Fade>
      </PageActions>
      { show && (
        <TableContainer>
          <Table documents={variables}>
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
        </TableContainer>
      ) }
    </>
  );
};
