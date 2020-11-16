import { ClassNameMap } from '@material-ui/core/styles/withStyles';

// Types
export interface StyledProps<ClassKey extends string> {
  classes?: Partial<ClassNameMap<ClassKey>>
}