import React, { MouseEvent, ReactNode } from 'react';
import { Theme, useMediaQuery } from '@material-ui/core';

import {
  Checkbox,
  TableCell, TableRow as MuiTableRow,
  TableRowProps as MuiTableRowProps
} from '@material-ui/core';

import { Document } from './document';
import { useTable } from './table.context';

// Types
export interface TableRowProps extends Omit<MuiTableRowProps, 'selected' | 'onClick'> {
  doc?: Document,
  children?: ReactNode
}

// Component
const TableRow = (props: TableRowProps) => {
  // Props
  const {
    doc, children,
    ...row
  } = props;

  // Contexts
  const ctx = useTable();

  // Handlers
  const handleChange = doc ? () => ctx.onSelect(doc.id) : ctx.onSelectAll;
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  }

  // Render
  const small = useMediaQuery(({ breakpoints }: Theme) => breakpoints.down('sm'));

  const selectable = doc ? ctx.blacklist.indexOf(doc.id) === -1 : true;
  const selected = doc ? (ctx.selected[doc.id] || false) : ctx.selectedAll;
  const indeterminate = !doc && ctx.selectedCount > 0 && !ctx.selectedAll;

  return (
    <MuiTableRow {...row}
      selected={selectable && doc && selected}
      onClick={(!selectable || !doc) ? undefined : handleChange}
    >
      { !small && (
        <TableCell padding="checkbox">
          { selectable && (
            <Checkbox
              checked={selected} indeterminate={indeterminate}
              disabled={ctx.selectableCount === 0}
              onChange={handleChange}
              onClick={handleClick}
            />
          ) }
        </TableCell>
      ) }
      { children }
    </MuiTableRow>
  )
};

export default TableRow;
