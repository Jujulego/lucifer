import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ManagementClient, User as Auth0User } from 'auth0';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';

import { IUser, User } from '@lucifer/types';

import { UpdateUser } from './user.schema';
import { LocalUser } from './local-user.entity';

// Service
@Injectable()
export class UsersService {
  // Attributes
  private readonly logger = new Logger(UsersService.name);

  // Constructor
  constructor(
    private auth0: ManagementClient,
    @InjectRepository(LocalUser) private repository: Repository<LocalUser>
  ) {}

  // Methods
  private format(ath: Auth0User, lcu?: LocalUser): User {
    // Mandatory fields
    const { user_id, name, email } = ath;

    if (!user_id || !name || !email) {
      this.logger.error(`Missing user_id, name or email in user ! (id: ${user_id}, name: ${name}, email: ${email})`);
      throw new InternalServerErrorException();
    }

    const usr: IUser = {
      id: user_id,
      name, email,
      machines: lcu?.machines ?? [],
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

  private formatAll(aths: Auth0User[], lcus: LocalUser[]): User[] {
    // Simple cases
    if (aths.length === 0) return [];
    if (lcus.length === 0) return aths.map(ath => this.format(ath));

    // Build users
    const results: User[] = [];
    let j = 0;

    for (let i = 0; i < aths.length; ++i) {
      const ath = aths[i];
      let added = false;

      // Search in locals
      while (j < lcus.length) {
        const lcu = lcus[j];

        if (lcu.id > ath.user_id!) break;
        if (lcu.id === ath.user_id) {
          added = true;
          results.push(this.format(ath, lcu));

          break;
        }

        ++j;
      }

      if (!added) {
        results.push(this.format(ath));
      }
    }

    return results;
  }

  async get(id: string): Promise<User> {
    const [ath, lcu] = await Promise.all([
      this.auth0.getUser({ id }),
      this.repository.findOne({
        relations: ['machines'],
        where: { id }
      }),
    ]);

    // Throw if not found
    if (!ath) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return this.format(ath, lcu);
  }

  async list(): Promise<User[]> {
    const [aths, lcus] = await Promise.all([
      this.auth0.getUsers({ sort: 'user_id:1' }),
      this.repository.find({
        order: { id: 'ASC' }
      })
    ]);

    return this.formatAll(aths, lcus);
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