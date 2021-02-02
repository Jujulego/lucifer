import { object, SchemaOf, string } from 'yup';

// Schema
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
