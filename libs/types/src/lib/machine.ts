// Interface
export interface IMachine {
  // Attributes
  id:        string;
  shortName: string;
  ownerId:   string;
}

// Model
export class Machine implements IMachine {
  // Attributes
  id:        string;
  shortName: string;
  ownerId:   string;
}
