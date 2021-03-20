import { CanActivate, CustomDecorator, ExecutionContext, Injectable, Logger, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import type { Permission } from '@lucifer/types';
import { ProjectMemberService } from '../projects/project-member.service';
import { Context } from '../context';

import type { AuthUser } from './user.model';

// Types
export type AllowIfCallback = (req: Request, user: AuthUser) => boolean;

// Constants
const METADATA_KEYS = {
  scopes:       Symbol('scope:scopes'),
  allow:        Symbol('scope:allow'),
  projectParam: Symbol('scope:project-param')
};

const PROJECT_ADMIN_PERMISSIONS: Permission[] = [
  'read:projects', 'update:projects', 'delete:projects',
  'create:api-keys', 'read:api-keys', 'update:api-keys', 'delete:api-keys',
  'create:variables', 'read:variables', 'update:variables', 'delete:variables'
];

const PROJECT_MEMBER_PERMISSIONS: Permission[] = [
  'read:projects',
  'read:api-keys',
  'create:variables', 'read:variables', 'update:variables', 'delete:variables'
];

// Decorators
export function Scopes(...scopes: Permission[]): CustomDecorator<symbol> {
  return SetMetadata(METADATA_KEYS.scopes, scopes);
}

export function AllowIf(cb: AllowIfCallback): CustomDecorator<symbol> {
  return SetMetadata(METADATA_KEYS.allow, cb);
}

export function ProjectIdParam(param: string): CustomDecorator<symbol> {
  return SetMetadata(METADATA_KEYS.projectParam, param);
}

// Guard
@Injectable()
export class ScopeGuard implements CanActivate {
  // Attributes
  private readonly _logger = new Logger(ScopeGuard.name);

  // Constructor
  constructor(
    private readonly reflector: Reflector,
    private readonly projectMembers: ProjectMemberService,
  ) {}

  // Methods
  private getMetadata<T>(exc: ExecutionContext, key: symbol): T | undefined {
    // On handler
    const metadata = this.reflector.get<T>(key, exc.getHandler());
    if (metadata !== undefined) return metadata;

    // On controller
    return this.reflector.get<T>(key, exc.getClass());
  }

  async canActivate(exc: ExecutionContext): Promise<boolean> {
    // Get metadata
    const scopes = this.getMetadata<Permission[]>(exc, METADATA_KEYS.scopes);
    const allow = this.getMetadata<AllowIfCallback>(exc, METADATA_KEYS.allow);
    const projectParam = this.getMetadata<string>(exc, METADATA_KEYS.projectParam);

    if (!scopes || scopes.length === 0) return true;

    // Get token
    const request = exc.switchToHttp().getRequest() as Request;
    const ctx = Context.fromRequest(request);

    if (!ctx.user) {
      this._logger.debug('Not logged: no user found');
      return false;
    }

    // Compute permissions
    const permissions = new Set(ctx.user.permissions);

    if (projectParam) {
      const projectId = request.params[projectParam];
      const mmb = await this.projectMembers.find(ctx.user.id, projectId);

      if (mmb) {
        for (const perm of mmb.admin ? PROJECT_ADMIN_PERMISSIONS : PROJECT_MEMBER_PERMISSIONS) {
          permissions.add(perm);
        }
      }
    }

    // Match
    if (allow && allow(request, ctx.user)) return true;
    const allowed = scopes.every(scope => permissions.has(scope));

    if (!allowed) {
      this._logger.debug(`Access refused: ${ctx.user.id} miss ${scopes} scopes`);
    }

    return allowed;
  }
}
