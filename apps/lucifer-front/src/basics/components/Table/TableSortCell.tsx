import React, { ReactNode } from 'react';

import {
  TableCell, TableSortLabel,
  TableCellProps
} from '@material-ui/core';

import { OrderByField } from 'src/utils/sort';

import { Document } from '../../models/document';
import { useTable } from '../../table.context';

// Types
export interface TableSortCellProps<T extends Document> extends Omit<TableCellProps, 'sortDirection'> {
  field: OrderByField<T>,
  children: ReactNode
}

// Component
const TableSortCell = <T extends Document> (props: TableSortCellProps<T>) => {
  // Props
  const {
    field, children,
    ...cell
  } = props;

  // Context
  const { ordering, onOrderBy } = useTable<T>();

  // Render
  return (
    <TableCell {...cell}
      sortDirection={ordering.field === field ? ordering.order : false}
    >
      <TableSortLabel
        active={ordering.field === field}
        direction={ordering.field === field ? ordering.order : 'asc'}
        onClick={() => onOrderBy(field)}
      >
        { children }
      </TableSortLabel>
    </TableCell>
  );
};

export default TableSortCell;
