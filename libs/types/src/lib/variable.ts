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

export interface ICreateVariable {
  id:    string;
  name:  string;
  value: string;
}

export interface IUpdateVariable {
  name?:  string;
  value?: string;
}
