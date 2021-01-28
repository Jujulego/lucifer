import React, { FC } from 'react';

import { Fade, Portal, TableCell, TableContainer, TableHead } from '@material-ui/core';
import { Table, TableBody, TableRow, TableSortCell } from '@lucifer/react/table';
import { IVariable } from '@lucifer/types';

import { useVariables } from './variables.hooks';
import { RefreshButton } from '@lucifer/react/basics';

// Types
export interface VariablesTableProps {
  adminId: string;
  projectId: string;
  show?: boolean;
  actionsContainer: HTMLElement | null;
}

// Component
export const VariablesTable: FC<VariablesTableProps> = (props) => {
  // Props
  const { adminId, show = true, projectId, actionsContainer } = props;

  // API
  const { variables = [], loading, reload } = useVariables(adminId, projectId);

  // Render
  return (
    <>
      <Portal container={actionsContainer}>
        <span>
          <Fade in={show}>
            <RefreshButton refreshing={loading} onClick={reload} />
          </Fade>
        </span>
      </Portal>
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
