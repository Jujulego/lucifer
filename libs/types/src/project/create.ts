import { object, SchemaOf, string } from 'yup';

// Schema
export interface ICreateProject {
  id:           string;
  name:         string;
  description?: string;
}

export const createProjectSchema: SchemaOf<ICreateProject> = object({
  id: string().required()
    .max(100, '100 charactères max.')
    .matches(/^[a-z0-9-]+$/, 'charactères autorisés: a-z, 0-9, -'),

  name: string().required()
    .max(100, '100 charactères max.'),

  description: string(),
});
