import { AppMetadata, ObjectWithId, Permission, UpdateUserData, User, UserMetadata } from 'auth0';

// Mock
export class ManagementClientMock<A = AppMetadata, U = UserMetadata> {
  // Methods
  async getUser(params: ObjectWithId): Promise<User<A, U> | undefined> {
    return { user_id: params.id };
  }

  async getUsers(): Promise<User<A, U>[]> {
    return [];
  }

  async getUserPermissions(params: ObjectWithId): Promise<Permission[]> {
    return [];
  }

  async updateUser(params: ObjectWithId, data: UpdateUserData): Promise<User<A, U> | undefined> {
    return { user_id: params.id, ...data } as User<A, U>;
  }
}
