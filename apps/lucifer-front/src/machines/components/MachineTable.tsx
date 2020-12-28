import React, { FC, useState } from 'react';

import { IconButton, TableCell, TableContainer, TableHead, makeStyles } from '@material-ui/core';
import { Edit as EditIcon } from '@material-ui/icons';

import { Table, TableBody, TableRow, TableSortCell } from '@lucifer/react/table';
import { IMachine } from '@lucifer/types';

import MachineDialog from './MachineDialog';

// Types
export interface MachineTableProps {
  machines: IMachine[];
  onSave: (mch: IMachine) => void;
}

// Styles
const useStyles = makeStyles({
  noPadding: {
    padding: 0,
  }
});

// Component
const MachineTable: FC<MachineTableProps> = (props) => {
  // Props
  const { machines, onSave } = props;

  // Save
  const [updateMachine, setUpdateMachine] = useState<IMachine | null>(null);

  // Render
  const styles = useStyles();

  return (
    <>
      <TableContainer>
        <Table id="machines-table" documents={machines}>
          <TableHead>
            <TableRow>
              <TableSortCell<IMachine> field="shortName">Nom</TableSortCell>
              <TableCell>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { (mch: IMachine) => (
              <TableRow key={mch.id} doc={mch}>
                <TableCell>
                  { mch.shortName }
                </TableCell>
                <TableCell className={styles.noPadding} onClick={event => event.stopPropagation()}>
                  <IconButton onClick={() => setUpdateMachine(mch)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ) }
          </TableBody>
        </Table>
      </TableContainer>
      <MachineDialog
        machine={updateMachine}
        onSave={onSave}
        onClose={() => setUpdateMachine(null)}
      />
    </>
  );
};

export default MachineTable;
