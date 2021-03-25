import { boolean, object, SchemaOf } from 'yup';

// Schema
export interface IUpdateProjectMember {
  admin?: boolean;
}

export const updateProjectMemberSchema: SchemaOf<IUpdateProjectMember> = object({
  admin: boolean(),
});
