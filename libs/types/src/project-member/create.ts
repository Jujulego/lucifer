import { boolean, object, SchemaOf, string } from 'yup';

// Schema
export interface ICreateProjectMember {
  projectId: string;
  userId:    string;
  admin?:    boolean;
}

export const createProjectMemberSchema: SchemaOf<ICreateProjectMember> = object({
  projectId: string().required()
    .max(100, '100 charactères max.')
    .matches(/^[a-z0-9-]+$/, 'charactères autorisés: a-z, 0-9, -'),

  userId: string().required(),
  admin: boolean(),
});
