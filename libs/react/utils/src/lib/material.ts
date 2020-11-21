import { ExtendButtonBase } from '@material-ui/core';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { OverridableTypeMap } from '@material-ui/core/OverridableComponent';

// Types
export type ExtendMatButton<M extends OverridableTypeMap> = (...args: Parameters<ExtendButtonBase<M>>) => JSX.Element | null;

export interface StyledProps<ClassKey extends string> {
  classes?: Partial<ClassNameMap<ClassKey>>
}
