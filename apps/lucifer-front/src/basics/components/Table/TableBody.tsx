import React, { ReactNode, useMemo } from 'react';

import {
  TableBody as MuiTableBody,
  TableBodyProps as MuiTableBodyProps
} from '@material-ui/core';

import { asc, Comparator, desc, OrderByField, stableSort } from 'src/utils/sort';

import { Document } from '../../models/document';
import { Order, useTable } from '../../table.context';

// Types
export interface TableBodyProps<T extends Document> extends Omit<MuiTableBodyProps, 'classes'> {
  children: (doc: T) => ReactNode
}

// Utils
function getSorting<T extends Document>(field: OrderByField<T>, order: Order): Comparator<T> {
  return order === 'desc' ? (a, b) => desc(a, b, field) : (a, b) => asc(a, b, field);
}

// Component
const TableBody = <T extends Document> (props: TableBodyProps<T>) => {
  // Props
  const { children, ...body } = props;

  // Contexts
  const { filtered, ordering, paginator } = useTable<T>();

  // Memos
  const sorted = useMemo(() => {
    if (ordering.field === undefined) return filtered;

    return stableSort(filtered, getSorting(ordering.field, ordering.order));
  }, [filtered, ordering]);

  const paginated = useMemo(() => {
    if (!paginator) return sorted;

    const { page, rowsPerPage } = paginator;
    return sorted.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  }, [sorted, paginator]);

  // Render
  if (paginated.length === 0) return null;

  return (
    <MuiTableBody {...body}>
      { paginated.map(children) }
    </MuiTableBody>
  );
};

export default TableBody;
