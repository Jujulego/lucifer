import { AppMetadata, ObjectWithId, User, UserMetadata } from 'auth0';

// Mock
export class ManagementClientMock<A = AppMetadata, U = UserMetadata> {
  // Methods
  getUser = async (params: ObjectWithId): Promise<User<A, U> | undefined> => {
    return { user_id: params.id };
  };
}
