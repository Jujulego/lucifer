import { object, SchemaOf, string } from 'yup';

// Schema
export interface IUpdateVariable {
  name?:  string;
  value?: string;
}

export const updateVariableSchema: SchemaOf<IUpdateVariable> = object({
  name: string()
    .max(100, '100 charactères max.'),

  value: string(),
});
