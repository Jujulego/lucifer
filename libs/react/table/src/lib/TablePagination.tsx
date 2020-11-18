import React, { ChangeEvent, ComponentType, ElementType, useEffect, useState } from 'react';

import {
  TablePagination as MuiTablePagination,
  TablePaginationClassKey as MuiTablePaginationClassKey,
  TablePaginationTypeMap as MuiTablePaginationTypeMap
} from '@material-ui/core';
import { TablePaginationBaseProps } from '@material-ui/core/TablePagination/TablePagination';
import { OverrideProps } from '@material-ui/core/OverridableComponent';

import { useTable } from './table.context';

// Types
type DefinedProps = 'count' | 'rowsPerPage' | 'page' | 'onChangePage' | 'onChangeRowsPerPage';
type DefaultElement = ComponentType<TablePaginationBaseProps>;

export type TablePaginationClassKey = MuiTablePaginationClassKey;

export interface TablePaginationTypeMap<P, D extends ElementType> {
  props: P & Omit<MuiTablePaginationTypeMap<P, D>['props'], DefinedProps>;
  defaultComponent: D;
  classKey: TablePaginationClassKey;
}

export type TablePaginationProps<
  D extends ElementType = ComponentType<TablePaginationBaseProps>,
  P = {}
> = OverrideProps<TablePaginationTypeMap<P, D>, D>;

// Constants
const DEFAULT_RPPO = [10, 25, 50, 100];

// Utils
function getFirst(rppo: TablePaginationProps['rowsPerPageOptions'] = DEFAULT_RPPO): number {
  const first = rppo[0];

  if (typeof first === "object") {
    return first.value;
  }

  return first;
}

// Component
const TablePagination = <D extends ElementType = DefaultElement> (props: { component: D } & TablePaginationProps<D>) => {
  // Props
  const {
    rowsPerPageOptions
  } = props;

  // State
  const [page, setPage]       = useState(0);
  const [rowsPerPage, setRPP] = useState(getFirst(rowsPerPageOptions));

  // Context
  const { filtered, onPaginate } = useTable();

  // Effects
  useEffect(() => {
    onPaginate({ page, rowsPerPage });
  }, [onPaginate, page, rowsPerPage]);

  // Handlers
  const handleChangeRPP = (event: ChangeEvent<HTMLInputElement>) => {
    setRPP(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Render
  return (
    <MuiTablePagination {...props}
      count={filtered.length}

      page={page}
      onChangePage={handleChangePage}

      rowsPerPage={rowsPerPage}
      onChangeRowsPerPage={handleChangeRPP}
    />
  );
};

export default TablePagination;
