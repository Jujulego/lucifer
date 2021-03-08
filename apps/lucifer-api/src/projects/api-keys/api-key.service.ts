import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as crypto from 'crypto';
import bcrypt from 'bcrypt';

import { IApiKeyWithKey, ICreateApiKey, IUpdateApiKey } from '@lucifer/types';

import { ApiKey } from './api-key.entity';
import { ProjectsService } from '../projects.service';

// Service
@Injectable()
export class ApiKeyService {
  // Attributes
  private readonly logger = new Logger(ApiKeyService.name);

  // Constructor
  constructor(
    private readonly projects: ProjectsService,
    @InjectRepository(ApiKey) private readonly repository: Repository<ApiKey>
  ) {}

  // Methods
  private async _get(adminId: string, projectId: string, id: string): Promise<ApiKey | null> {
    const apk = await this.repository.findOne({
      where: { adminId, projectId, id }
    });

    return apk || null;
  }

  async create(adminId: string, projectId: string, data: ICreateApiKey): Promise<IApiKeyWithKey> {
    // Ensure projects exists
    await this.projects.get(adminId, projectId);

    // Create new api key
    let apk = this.repository.create({
      ...data,
      adminId, projectId
    });

    // Generate key
    const key = crypto.randomBytes(60).toString('base64');
    apk.key = await bcrypt.hash(key, 10);

    apk = await this.repository.save(apk);
    return { ...apk, key };
  }

  async list(adminId: string, projectId: string): Promise<ApiKey[]> {
    return await this.repository.find({
      where: { adminId, projectId }
    });
  }

  async get(adminId: string, projectId: string, id: string): Promise<ApiKey> {
    const apk = await this._get(adminId, projectId, id);

    if (!apk) {
      throw new NotFoundException(`Api key ${id} not found`);
    }

    return apk;
  }

  async check(id: string, key: string): Promise<ApiKey> {
    // Get api key
    const apk = await this.repository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!apk) {
      this.logger.debug(`Use of key ${id} refused (unknown key)`);
      throw new UnauthorizedException();
    }

    // Check key
    const valid = await bcrypt.compare(key, apk.key);

    if (!valid) {
      this.logger.debug(`Use of key ${id} refused (invalid key)`);
      throw new UnauthorizedException();
    }

    return apk;
  }

  async update(adminId: string, projectId: string, id: string, update: IUpdateApiKey): Promise<ApiKey> {
    const apk = await this.get(adminId, projectId, id);

    // Apply update
    apk.label = update.label ?? apk.label;

    return await this.repository.save(apk);
  }

  async delete(adminId: string, projectId: string, ids: string[]): Promise<number | null> {
    const { affected } = await this.repository.delete({ adminId, projectId, id: In(ids) });
    return affected ?? null;
  }
}
