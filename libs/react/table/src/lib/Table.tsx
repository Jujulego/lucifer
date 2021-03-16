import React, {
  MutableRefObject,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  Table as MuiTable,
  TableProps as MuiTableProps,
  TableClassKey as MuiTableClassKey
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Filter, OrderByField, toPredicate } from '@lucifer/utils';
import { StyledProps } from '@lucifer/react-utils';

import { Document } from './document';
import { Order, Ordering, Paginator, SelectState, TableContext } from './table.context';

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
  selectionRef?: MutableRefObject<T[]>
}

// Component
const Table = <T extends Document> (props: PropsWithChildren<TableProps<T>>) => {
  // Props
  const {
    documents, blacklist = [],
    toolbar, pagination, classes,
    selectionRef,
    children,
    ...table
  } = props;

  // State
  const [filter,    setFilter]    = useState<Filter<T>>({});
  const [ordering,  setOrdering]  = useState<Ordering<T>>({ order: 'asc' });
  const [selected,  setSelected]  = useState<SelectState>(new Set());
  const [paginator, setPaginator] = useState<Paginator>();

  // Effects
  useEffect(() => {
    setSelected(new Set());
  }, [documents]);

  useEffect(() => {
    if (selectionRef) {
      selectionRef.current = documents.filter(doc => selected.has(doc.id));
    }
  }, [selectionRef, selected, documents]);

  // Memos
  const filtered = useMemo(
    () => documents.filter(toPredicate(filter)),
    [documents, filter]
  );

  const blacklistCount = useMemo(
    () => filtered.reduce((count, doc: T) => (blacklist.indexOf(doc.id) === -1) ? count : count + 1, 0),
    [blacklist, filtered] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const selectedCount = useMemo(
    () => filtered.reduce((count, doc: T) => selected.has(doc.id) ? count + 1 : count, 0),
    [selected, filtered] // eslint-disable-line react-hooks/exhaustive-deps
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
  }, [setOrdering]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSelect = useCallback((id: number | string) => setSelected(old => {
    const set = new Set(old);

    if (set.has(id)) {
      set.delete(id);
    } else {
      set.add(id);
    }

    return set;
  }), [setSelected]);

  const onSelectAll = useCallback(() => {
    if (selectedAll) {
      setSelected(new Set());
    } else {
      setSelected(filtered.reduce<SelectState>((acc, doc) => {
        if (blacklist.indexOf(doc.id) === -1) {
          acc.add(doc.id);
        }

        return acc;
      }, new Set()));
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
