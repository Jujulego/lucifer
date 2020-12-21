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

// Model
export class Machine implements IMachine {
  // Attributes
  id:        string;
  shortName: string;
  ownerId:   string;
}
