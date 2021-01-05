// Interface
export interface IProject {
  // Id
  id:      string;
  adminId: string;

  // Metadata
  name:        string;
  description: string;
}

export interface ICreateProject {
  id:           string;
  name:         string;
  description?: string;
}

export interface IUpdateProject {
  name?:        string;
  description?: string;
}
