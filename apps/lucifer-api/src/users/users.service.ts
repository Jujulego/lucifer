import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ManagementClient, User as Auth0User } from 'auth0';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';

import { IUpdateUser, IUser, User } from '@lucifer/types';
import { Context } from '../context';

import { LocalUser } from './local-user.entity';
import { RolesService } from './roles.service';

// Service
@Injectable()
export class UsersService {
  // Attributes
  private readonly logger = new Logger(UsersService.name);

  // Constructor
  constructor(
    private readonly auth0: ManagementClient,
    private readonly roles: RolesService,
    @InjectRepository(LocalUser) private readonly repository: Repository<LocalUser>
  ) {}

  // Methods
  private _canUpdate(ath: Auth0User): boolean {
    return ath.identities?.some(id => id.provider === 'auth0') ?? true;
  }

  private _format(ath: Auth0User, lcu?: LocalUser): User {
    // Mandatory fields
    const { user_id, name, email } = ath;

    if (!user_id || !name || !email) {
      this.logger.error(`Missing user_id, name or email in user ! (id: ${user_id}, name: ${name}, email: ${email})`);
      throw new InternalServerErrorException();
    }

    const usr: IUser = {
      id:        user_id,
      name:      name,
      email:     email,
      canUpdate: this._canUpdate(ath)
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

  private _formatAll(aths: Auth0User[], lcus: LocalUser[]): User[] {
    // Simple cases
    if (aths.length === 0) return [];
    if (lcus.length === 0) return aths.map(ath => this._format(ath));

    // Build users
    const results: User[] = [];
    let j = 0;

    for (let i = 0; i < aths.length; ++i) {
      const ath = aths[i];
      let added = false;

      // Search in locals
      while (j < lcus.length) {
        const lcu = lcus[j];

        if (lcu.id.localeCompare(ath.user_id || '') > 0) break;
        if (lcu.id === ath.user_id) {
          added = true;
          results.push(this._format(ath, lcu));

          break;
        }

        ++j;
      }

      if (!added) {
        results.push(this._format(ath));
      }
    }

    return results;
  }

  async getLocal(id: string): Promise<LocalUser> {
    // Check if user exists
    const ath = await this.auth0.getUser({ id });

    if (!ath) {
      throw new NotFoundException(`User ${id} not found`);
    }

    // Get or create local user
    let lcu = await this.repository.findOne({ id });

    if (!lcu) {
      lcu = this.repository.create({ id });
      await this.repository.save(lcu);
    }

    return lcu;
  }

  async get(id: string): Promise<User> {
    const [ath, roles, lcu] = await Promise.all([
      this.auth0.getUser({ id }),
      this.roles.getUserRoles(id),
      this.repository.findOne({
        where: { id }
      }),
    ]);

    // Throw if not found
    if (!ath) {
      throw new NotFoundException(`User ${id} not found`);
    }

    // Build users
    const usr = this._format(ath, lcu);
    usr.roles = roles || [];

    return usr;
  }

  async list(): Promise<User[]> {
    const [aths, lcus] = await Promise.all([
      this.auth0.getUsers({ sort: 'user_id:1' }),
      this.repository.find({
        order: { id: 'ASC' }
      })
    ]);

    return this._formatAll(aths, lcus);
  }

  async update(ctx: Context, id: string, update: IUpdateUser): Promise<User> {
    // Get current state
    // eslint-disable-next-line prefer-const
    let [ath, roles, lcu] = await Promise.all([
      this.auth0.getUser({ id }),
      this.roles.getUserRoles(id),
      this.repository.findOne({
        where: { id }
      })
    ]);

    // Error cases
    if (!ath) throw new NotFoundException(`User ${id} not found`);
    if (update.roles) ctx.need('update:roles');

    // Updates
    if (this._canUpdate(ath) && (update.name || update.email)) {
      ath = await this.auth0.updateUser({ id }, {
        name: update.name ?? ath.name,
        email: update.email ?? ath.email
      });
    }

    if (update.roles) {
      roles = await this.roles.updateUserRoles(ctx, id, update.roles);
    }

    // Build user
    const usr = this._format(ath, lcu);
    usr.roles = roles || [];

    return usr;
  }
}
