import { AppMetadata, ObjectWithId, Role, RolesData, UpdateUserData, User, UserMetadata } from 'auth0';
import cloneDeep from 'lodash.clonedeep';
import { RoleName, ROLES } from '@lucifer/types';

// Types
type RoleMap = Record<string, RoleName[]>;

// Mock
export class ManagementClientMock<A = AppMetadata, U = UserMetadata> {
  // Attributes
  private _users?: User<A, U>[];
  private _roles: RoleMap = {};

  // Methods
  mockSetUsers(users: User<A, U>[])  {
    this._users = cloneDeep(users);
  }

  mockUserRoles(roles: RoleMap) {
    this._roles = cloneDeep(roles);
  }

  // - users
  async getUser(params: ObjectWithId): Promise<User<A, U> | undefined> {
    if (this._users) {
      return this._users.find(usr => usr.user_id === params.id);
    }

    return {
      user_id: params.id,
      email:   params.id + '@test.com',
      name:    params.id
    };
  }

  async getUsers(): Promise<User<A, U>[]> {
    return this._users || [];
  }

  async updateUser(params: ObjectWithId, data: UpdateUserData): Promise<User<A, U> | undefined> {
    const user = await this.getUser(params);
    if (user) Object.assign(user, data);

    return user;
  }

  // - roles
  private _buildRole = (name: RoleName): Role => ({
    id: `role-${name}`,
    name,
  });

  async getRoles(): Promise<Role[]> {
    return ROLES.map(this._buildRole);
  }

  async getUserRoles(params: ObjectWithId): Promise<Role[]> {
    if (this._roles) {
      return (this._roles[params.id] || []).map(this._buildRole);
    }

    return [];
  }

  async assignRolestoUser(params: ObjectWithId, data: RolesData): Promise<void> {
    return;
  }

  async removeRolesFromUser(params: ObjectWithId, data: RolesData): Promise<void> {
    return;
  }
}
