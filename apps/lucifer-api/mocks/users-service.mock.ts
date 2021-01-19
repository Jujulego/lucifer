import { Injectable } from '@nestjs/common';

import { User } from '@lucifer/types';

import { Context } from '../src/context';
import { LocalUser } from '../src/users/local-user.entity';
import { UsersService } from '../src/users/users.service';
import { UpdateUser } from '../src/users/user.schema';

// Class
@Injectable()
export class UsersServiceMock extends UsersService {
  // Methods
  async getLocal(id: string): Promise<LocalUser> {
    const lcu = new LocalUser();
    lcu.id = id;

    return lcu;
  }

  async get(id: string): Promise<User> {
    const usr = new User();
    usr.id = id;
    usr.name = "Test test";
    usr.email = "test@test.com";

    return usr;
  }

  async list(): Promise<User[]> {
    return [];
  }

  async update(ctx: Context, id: string, update: UpdateUser): Promise<User> {
    const usr = new User();
    usr.id = id;
    usr.name = update.name ?? "Test test";
    usr.email = update.email ?? "test@test.com";

    return usr;
  }
}
