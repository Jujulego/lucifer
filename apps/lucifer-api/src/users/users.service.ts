import { Injectable, NotFoundException } from '@nestjs/common';
import { ManagementClient, User as Auth0User } from 'auth0';

import { User, UpdateUser } from './user.model';

// Service
@Injectable()
export class UsersService {
  // Constructor
  constructor(
    private auth0: ManagementClient
  ) {}

  // Statics
  private static format(ath: Auth0User): User {
    // Mandatory fields
    const usr: User = {
      id:    ath.user_id!,
      name:  ath.name!,
      email: ath.email!,
    };

    // Optional fields
    if ('email_verified' in ath) usr.emailVerified = ath.email_verified;
    if ('nickname'    in ath) usr.nickname   = ath.nickname;
    if ('username'    in ath) usr.username   = ath.username;
    if ('given_name'  in ath) usr.givenName  = ath.given_name;
    if ('family_name' in ath) usr.familyName = ath.family_name;
    if ('created_at'  in ath) usr.createdAt  = ath.created_at;
    if ('updated_at'  in ath) usr.updatedAt  = ath.updated_at;
    if ('picture'     in ath) usr.picture    = ath.picture;
    if ('last_ip'     in ath) usr.lastIp     = ath.last_ip;
    if ('last_login'  in ath) usr.lastLogin  = ath.last_login;
    if ('blocked'     in ath) usr.blocked    = ath.blocked;

    return usr;
  }

  // Methods
  async get(id: string): Promise<User> {
    const user = await this.auth0.getUser({ id });

    // Throw if not found
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return UsersService.format(user);
  }

  async list(): Promise<User[]> {
    const users = await this.auth0.getUsers({ sort: 'user_id:1' });

    return users.map(usr => UsersService.format(usr));
  }

  async update(id: string, update: UpdateUser): Promise<User> {
    const user = await this.auth0.updateUser({ id }, {
      name: update.name,
      email: update.email
    });

    // Throw if not found
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return UsersService.format(user);
  }
}
