import { AppMetadata, ObjectWithId, Role, RolesData, UpdateUserData, User, UserMetadata } from 'auth0';
import { ROLES } from '@lucifer/types';

// Mock
export class ManagementClientMock<A = AppMetadata, U = UserMetadata> {
  // Methods
  // - users
  async getUser(params: ObjectWithId): Promise<User<A, U> | undefined> {
    return { user_id: params.id };
  }

  async getUsers(): Promise<User<A, U>[]> {
    return [];
  }

  async updateUser(params: ObjectWithId, data: UpdateUserData): Promise<User<A, U> | undefined> {
    return { user_id: params.id, ...data } as User<A, U>;
  }

  // - roles
  async getRoles(): Promise<Role[]> {
    return ROLES.map((name, i) => ({ name, id: `role-${i}` }));
  }

  async getUserRoles(params: ObjectWithId): Promise<Role[]> {
    return [];
  }

  async assignRolestoUser(params: ObjectWithId, data: RolesData): Promise<void> {
    return;
  }

  async removeRolesFromUser(params: ObjectWithId, data: RolesData): Promise<void> {
    return;
  }
}
