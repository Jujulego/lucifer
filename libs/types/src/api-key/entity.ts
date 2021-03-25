// Interface
export interface IApiKey {
  // Attributes
  id:        string;
  projectId: string;
  label:     string;
}

export interface IApiKeyWithKey extends IApiKey {
  // Attributes
  key: string;
}
