// Interface
export interface IVariable {
  projectId: string;
  adminId:   string;
  name:      string;
  value:     string | null;
}

export interface ICreateVariable {
  projectId: string;
  adminId:   string;
  name:      string;
  value:     string | null;
}

export interface IUpdateVariable {
  name?:  string;
  value?: string | null;
}
