import { array, mixed, object, SchemaOf, string } from 'yup';

import { RoleName, ROLES } from './entity';

// Schema
export interface IUpdateUser {
  name?:  string;
  email?: string;
  roles?: RoleName[];
}

export const updateUserSchema: SchemaOf<IUpdateUser> = object({
  name: string(),
  email: string().email(),
  roles: array().of(
    mixed().oneOf(ROLES)
  )
});
