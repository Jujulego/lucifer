// Resources
type RUResource = 'roles' | 'users';
type CRUDResource = 'machines' | 'projects' | 'variables';
export type Resource = CRUDResource | RUResource;

// Levels
type RULevel = 'read' | 'update';
export type AccessLevel = 'create' | RULevel | 'delete';

// Permissions
export type Permission = `${AccessLevel}:${CRUDResource}` | `${RULevel}:${RUResource}`;
