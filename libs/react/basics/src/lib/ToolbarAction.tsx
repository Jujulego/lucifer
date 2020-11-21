import React, { ElementType } from 'react';

import {
  ExtendButtonBase,
  ExtendButtonBaseTypeMap,
  IconButton, IconButtonClassKey, IconButtonTypeMap,
  Tooltip, TooltipProps
} from '@material-ui/core';

import { OverrideProps } from '@material-ui/core/OverridableComponent';

// Types
export type ToolbarActionClassKey = Exclude<IconButtonClassKey, 'colorPrimary' | 'colorSecondary'>;
export type ToolbarActionTypeMap<
  P = unknown,
  D extends ElementType = 'button'
> = ExtendButtonBaseTypeMap<{
  props: P & Omit<IconButtonTypeMap<P, D>['props'], 'color'> & {
    tooltip?: string,
    tooltipProps?: Omit<TooltipProps, 'title'>
  };
  defaultComponent: D;
  classKey: ToolbarActionClassKey;
}>;

export type ToolbarActionProps<
  D extends ElementType = ToolbarActionTypeMap['defaultComponent'],
  P = unknown
> = OverrideProps<ToolbarActionTypeMap<P, D>, D>;

// Component
const ToolbarAction: ExtendButtonBase<ToolbarActionTypeMap> = <D extends ElementType> (props: { component?: D } & ToolbarActionProps<D>) => {
  // Props
  const {
    children, disabled,
    tooltip, tooltipProps,
    ...button
  } = props;

  // Render
  const btn = (
    <IconButton {...button} disabled={disabled} color="inherit">
      { children }
    </IconButton>
  );

  if (disabled) return btn;
  if (!tooltip) return btn;

  return (
    <Tooltip {...tooltipProps} title={tooltip}>
      { btn }
    </Tooltip>
  );
};

export default ToolbarAction;
