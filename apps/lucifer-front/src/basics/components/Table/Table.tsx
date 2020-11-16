import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import {
  Table as MuiTable,
  TableProps as MuiTableProps,
  TableClassKey as MuiTableClassKey
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Filter, toPredicate } from 'src/utils/filter';
import { OrderByField } from 'src/utils/sort';
import { StyledProps } from 'src/utils/style';

import { Document } from '../../models/document';
import { Order, Ordering, Paginator, SelectState, TableContext } from '../../table.context';

// Styles
const useStyles = makeStyles({
  root: {
    '&:last-child > :last-child > tr:last-child': {
      '& > td, & > th': {
        borderBottom: 'none'
      }
    }
  }
});

// Types
export type TableClassKey = 'root' | MuiTableClassKey;
export interface TableProps<T extends Document> extends MuiTableProps, StyledProps<TableClassKey> {
  documents: T[],
  blacklist?: Array<number | string>,
  toolbar?: ReactNode,
  pagination?: ReactNode,
  children?: ReactNode
}

// Component
const Table = <T extends Document> (props: TableProps<T>) => {
  // Props
  const {
    documents, blacklist = [],
    toolbar, pagination, classes,
    children,
    ...table
  } = props;

  // State
  const [filter,    setFilter]    = useState<Filter<T>>({});
  const [ordering,  setOrdering]  = useState<Ordering<T>>({ order: 'asc' });
  const [selected,  setSelected]  = useState<SelectState>({});
  const [paginator, setPaginator] = useState<Paginator>();

  // Effects
  useEffect(() => {
    setSelected({});
  }, [documents]);

  // Memos
  const filtered = useMemo(
    () => documents.filter(toPredicate(filter)),
    [documents, filter]
  );

  const blacklistCount = useMemo(
    () => filtered.reduce((count, doc: T) => (blacklist.indexOf(doc.id) === -1) ? count : count + 1, 0),
    [blacklist, filtered]
  );

  const selectedCount = useMemo(
    () => filtered.reduce((count, doc: T) => selected[doc.id] ? count + 1 : count, 0),
    [selected, filtered]
  );

  const selectedAll = selectedCount >= (filtered.length - blacklistCount);

  // Callbacks
  const onOrderBy = useCallback((field: OrderByField<T>) => {
    setOrdering(old => {
      let order: Order = 'asc';

      if (old.field === field && old.order === 'asc') {
        order = 'desc';
      }

      return { field, order };
    });
  }, [setOrdering]);

  const onSelect = useCallback((id: number | string) => setSelected(old => ({ ...old, [id]: !old[id] })), [setSelected]);
  const onSelectAll = useCallback(() => {
    if (selectedAll) {
      setSelected({});
    } else {
      setSelected(filtered.reduce<SelectState>((acc, doc) => {
        if (blacklist.indexOf(doc.id) === -1) {
          acc[doc.id] = true;
        }

        return acc;
      }, {}));
    }
  }, [blacklist, filtered, selectedAll]);

  // Render
  const styles = useStyles(props);

  return (
    <TableContext.Provider
      value={{
        documents, blacklist, filtered,
        filter, ordering, paginator,
        selected, selectedCount,
        selectableCount: filtered.length - blacklistCount,
        selectedAll: selectedCount > 0 && selectedAll,
        onFilter: setFilter,
        onOrderBy,
        onPaginate: setPaginator,
        onSelect, onSelectAll,
      }}
    >
      { toolbar }
      <MuiTable {...table} classes={{ ...classes, root: styles.root }}>
        { children }
      </MuiTable>
      { pagination }
    </TableContext.Provider>
  );
};

export default Table;
