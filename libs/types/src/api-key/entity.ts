// Interface
export interface IApiKey {
  // Attributes
  userId: string;
  id:     string;
  label:  string;
}

export interface IApiKeyWithKey extends IApiKey {
  // Attributes
  key: string;
}
