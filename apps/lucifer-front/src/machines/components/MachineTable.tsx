import React, { FC } from 'react';

import { TableCell, TableContainer, TableHead } from '@material-ui/core';

import { Table, TableBody, TableRow, TableSortCell } from '@lucifer/react/table';
import { IMachine } from '@lucifer/types';

import { useMachines } from '../machine.hooks';

// Types
export interface MachineTableProps {
  userId: string;
}

// Component
const MachineTable: FC<MachineTableProps> = (props) => {
  // Props
  const { userId } = props;

  // API
  const { machines = [] } = useMachines(userId);

  // Render
  return (
    <TableContainer>
      <Table documents={machines}>
        <TableHead>
          <TableRow>
            <TableSortCell<IMachine> field="id">Identifiant</TableSortCell>
            <TableSortCell<IMachine> field="shortName">Nom</TableSortCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { (mch: IMachine) => (
            <TableRow key={mch.id} doc={mch}>
              <TableCell>
                { mch.id }
              </TableCell>
              <TableCell>
                { mch.shortName }
              </TableCell>
            </TableRow>
          ) }
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MachineTable;
