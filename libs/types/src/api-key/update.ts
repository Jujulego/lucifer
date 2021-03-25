import { object, SchemaOf, string } from 'yup';

// Schema
export interface IUpdateApiKey {
  label?: string;
}

export const updateApiKeySchema: SchemaOf<IUpdateApiKey> = object({
  label: string()
    .max(100, '100 charactères max.'),
});
