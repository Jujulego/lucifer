import { SchemaOf, object, string } from 'yup';

// Interface
export interface IVariable {
  // Id
  id:        string;
  projectId: string;
  adminId:   string;

  // Data
  name:  string;
  value: string;
}

// Schemas
export interface ICreateVariable {
  id:    string;
  name:  string;
  value: string;
}

export const createVariableSchema: SchemaOf<ICreateVariable> = object({
  id: string().required()
    .max(100, '100 charactères max.')
    .matches(/^[a-z0-9-]+$/, 'charactères autorisés: a-z, 0-9, -'),

  name: string().required()
    .max(100, '100 charactères max.'),

  value: string().required(),
});

export interface IUpdateVariable {
  name?:  string;
  value?: string;
}
