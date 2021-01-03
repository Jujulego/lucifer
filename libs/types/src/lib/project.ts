// Interface
export interface IProject {
  // Id
  id:      string;
  adminId: string;

  // Metadata
  name:         string;
  description?: string;
}

export interface ICreateProject {
  name:         string;
  description?: string;
}

export type IUpdateProject = Partial<ICreateProject>

// Model
export class Project implements IProject {
  // Id
  id:      string;
  adminId: string;

  // Metadata
  name:         string;
  description?: string;
}
