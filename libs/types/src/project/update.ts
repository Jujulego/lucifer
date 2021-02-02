import { object, SchemaOf, string } from 'yup';

// Schema
export interface IUpdateProject {
  name?:        string;
  description?: string;
}

export const updateProjectSchema: SchemaOf<IUpdateProject> = object({
  name: string()
    .max(100, '100 charactères max.'),

  description: string(),
});
