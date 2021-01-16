import { ManagementClient, Role } from 'auth0';
import { Injectable, Logger } from '@nestjs/common';
import { RoleName } from '@lucifer/types';

import { Context } from '../context';

// Types
type RoleMap = Record<RoleName, Role>;

// Service
@Injectable()
export class RolesService {
  // Attributes
  private _logger = new Logger(RolesService.name);
  private _cache?: RoleMap;

  // Constructor
  constructor(
    private readonly auth0: ManagementClient
  ) {}

  // Methods
  private async _fetchRoles(): Promise<RoleMap> {
    if (!this._cache) {
      this._logger.debug('Fetching roles ...');

      // Fetch roles
      const roles = await this.auth0.getRoles();
      this._cache = roles.reduce<Partial<RoleMap>>(
        (map, role) => Object.assign(map, { [role.name as RoleName]: role }), {}
      ) as RoleMap;
    }

    return this._cache;
  }

  private async _assignRoles(ctx: Context, userId: string, roles: RoleName[]) {
    if (roles.length === 0) return;
    ctx.need('update:roles');

    // Assign roles
    const map = await this._fetchRoles();
    await this.auth0.assignRolestoUser(
      { id: userId },
      { roles: roles.map(role => map[role].id!)}
    );
  }

  private async _removeRoles(ctx: Context, userId: string, roles: RoleName[]) {
    if (roles.length === 0) return;
    ctx.need('update:roles');

    // Remove roles
    const map = await this._fetchRoles();
    await this.auth0.removeRolesFromUser(
      { id: userId },
      { roles: roles.map(role => map[role].id!)}
    );
  }

  async getUserRoles(userId: string): Promise<RoleName[]> {
    const roles = await this.auth0.getUserRoles({ id: userId });
    return roles.map(role => role.name as RoleName);
  }

  async updateUserRoles(ctx: Context, userId: string, target: RoleName[]) {
    const current = await this.getUserRoles(userId);

    // Compute diff
    const toAssign = target.filter(role => !current.includes(role));
    const toRemove = current.filter(role => !target.includes(role));

    // Updates
    await Promise.all([
      this._assignRoles(ctx, userId, toAssign),
      this._removeRoles(ctx, userId, toRemove)
    ]);
  }
}
