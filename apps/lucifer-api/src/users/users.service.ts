import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ManagementClient, User as Auth0User } from 'auth0';
import { plainToClass } from 'class-transformer';

import { User } from '@lucifer/types';
import { UpdateUser } from './user.schema';

// Service
@Injectable()
export class UsersService {
  // Attributes
  private readonly logger = new Logger(UsersService.name);

  // Constructor
  constructor(
    private auth0: ManagementClient
  ) {}

  // Methods
  private format(ath: Auth0User): User {
    // Mandatory fields
    const { user_id, name, email } = ath;

    if (!user_id || !name || !email) {
      this.logger.error(`Missing user_id, name or email in user ! (id: ${user_id}, name: ${name}, email: ${email})`);
      throw new InternalServerErrorException();
    }

    const usr: User = {
      id: user_id,
      name, email,
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

    return plainToClass(User, usr);
  }

  async get(id: string): Promise<User> {
    const user = await this.auth0.getUser({ id });

    // Throw if not found
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return this.format(user);
  }

  async list(): Promise<User[]> {
    const users = await this.auth0.getUsers({ sort: 'user_id:1' });

    return users.map(usr => this.format(usr));
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

    return this.format(user);
  }
}
