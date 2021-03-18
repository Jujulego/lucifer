import { object, SchemaOf, string } from 'yup';

// Schema
export interface IProjectFilters {
  member?: string
}

export const projectFiltersSchema: SchemaOf<IProjectFilters> = object({
  member: string(),
});
