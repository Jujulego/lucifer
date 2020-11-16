import { AppMetadata, ObjectWithId, User, UserMetadata } from 'auth0';

// Mock
export class ManagementClientMock<A = AppMetadata, U = UserMetadata> {
  // Methods
  async getUser(params: ObjectWithId): Promise<User<A, U> | null> {
    return { user_id: params.id };
  }

  async getUsers(): Promise<User<A, U>[]> {
    return [];
  }
}
