import React, { ElementType, MouseEvent } from 'react';

import { ExtendButtonBaseTypeMap } from '@material-ui/core';
import { OverrideProps } from '@material-ui/core/OverridableComponent';

import { ToolbarAction, ToolbarActionTypeMap, ToolbarActionClassKey } from '@lucifer/react/basics';
import { ExtendMatButton } from '@lucifer/react/utils';
import { Document } from './document';
import { useTable } from './table.context';

// Types
type When = "always" | "some" | "nothing"; // selected

export type TableActionClassKey = ToolbarActionClassKey;
export type TableActionTypeMap<
  T extends Document,
  P = unknown,
  D extends ElementType = 'button'
> = ExtendButtonBaseTypeMap<{
  props: P & ToolbarActionTypeMap<P, D>['props'] & {
    when?: When,
    onActivate?: (documents: T[]) => void
  };
  defaultComponent: D;
  classKey: TableActionClassKey;
}>;

export type TableActionProps<
  T extends Document,
  D extends ElementType = TableActionTypeMap<T>['defaultComponent'],
  P = unknown
> = OverrideProps<TableActionTypeMap<T, P, D>, D>;

// Component
const TableAction: ExtendMatButton<TableActionTypeMap<never>>
  = <T extends Document, D extends ElementType> (props: { component?: D } & TableActionProps<T, D>) => {
  // Props
  const {
    children, tooltip, when = "always",
    onActivate, onClick,
    ...action
  } = props;

  // Contexts
  const { filtered, selected, selectedCount } = useTable<T>();

  // Handlers
  const handleClick = onActivate ?
    ((event: MouseEvent<HTMLButtonElement>) => {
      // Get selected components
      const docs = filtered.filter(doc => selected.has(doc.id));

      // Events !
      if (onClick) onClick(event);
      onActivate(docs);
    }) : onClick;

  // Render
  if (when === "some" && selectedCount === 0)    return null;
  if (when === "nothing" && selectedCount !== 0) return null;

  return (
    <ToolbarAction {...action} tooltip={tooltip} onClick={handleClick}>
      { children }
    </ToolbarAction>
  );
};

export default TableAction;
