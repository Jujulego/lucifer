// Interfaces
export interface ValidationError<T extends Record<string, unknown>> {
  path: keyof T;
  type?: string;
  errors: string[];
}
