import React, { FC } from 'react';

import { TableCell, TableContainer, TableHead } from '@material-ui/core';

import { Table, TableBody, TableRow, TableSortCell } from '@lucifer/react/table';
import { IMachine } from '@lucifer/types';

// Types
export interface MachineTableProps {
  machines: IMachine[];
}

// Component
const MachineTable: FC<MachineTableProps> = (props) => {
  // Props
  const { machines } = props;

  // Render
  return (
    <TableContainer>
      <Table id="machines-table" documents={machines}>
        <TableHead>
          <TableRow>
            <TableSortCell<IMachine> field="shortName">Nom</TableSortCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { (mch: IMachine) => (
            <TableRow key={mch.id} doc={mch}>
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
