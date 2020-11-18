import { createContext, useContext } from 'react';

import { Filter, OrderByField } from '@lucifer/utils';

import { Document } from './document';

// Types
export type SelectState = {
  [id in number | string]: boolean;
};

export type Order = 'asc' | 'desc';
export interface Ordering<T extends Document> {
  field?: OrderByField<T>;
  order: Order;
}

export interface Paginator {
  page: number;
  rowsPerPage: number;
}

export interface TableContextProps<T extends Document> {
  blacklist: Array<number | string>;
  documents: T[];
  filter: Filter<T>; filtered: T[];
  ordering: Ordering<T>;

  selectedAll: boolean;
  selectableCount: number;
  selectedCount: number;
  selected: SelectState;

  paginator?: Paginator;

  onSelect: (id: number | string) => void;
  onSelectAll: () => void;
  onFilter: (filter: Filter<T>) => void;
  onOrderBy: (field: OrderByField<T>) => void;
  onPaginate: (paginator: Paginator) => void;
}

// Defaults
const tableDefaults: TableContextProps<any> = {
  blacklist: [],
  documents: [],
  filter: {}, filtered: [],
  ordering: { order: 'asc' },

  selectedAll: false,
  selectableCount: 0, selectedCount: 0,
  selected: {},

  onSelect: () => {},
  onSelectAll: () => {},
  onFilter: () => {},
  onOrderBy: () => {},
  onPaginate: () => {}
}

// Context
export const TableContext = createContext(tableDefaults);

// Hook
export function useTable<T extends Document = any>(): TableContextProps<T> {
  return useContext(TableContext);
}
