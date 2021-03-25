import { object, SchemaOf, string } from 'yup';

// Schema
export interface ICreateApiKey {
  label?: string;
}

export const createApiKeySchema: SchemaOf<ICreateApiKey> = object({
  label: string()
    .max(100, '100 charactères max.'),
});
