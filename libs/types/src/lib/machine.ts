// Interfaces
export interface IMachine {
  // Attributes
  id:        string;
  shortName: string;
  ownerId:   string;
}

export interface ICreateMachine {
  shortName: string;
}

export type IUpdateMachine = Partial<ICreateMachine>

// Model
export class Machine implements IMachine {
  // Attributes
  id:        string;
  shortName: string;
  ownerId:   string;
}
