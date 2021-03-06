import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import bcrypt from 'bcrypt';

import { IApiKeyWithKey, ICreateApiKey, IUpdateApiKey } from '@lucifer/types';

import { ApiKey } from './api-key.entity';
import { UsersService } from './users.service';
import * as crypto from 'crypto';

// Service
@Injectable()
export class ApiKeyService {
  // Attributes
  private readonly logger = new Logger(ApiKeyService.name);

  // Constructor
  constructor(
    private readonly users: UsersService,
    @InjectRepository(ApiKey) private readonly repository: Repository<ApiKey>
  ) {}

  // Methods
  private async _get(userId: string, id: string): Promise<ApiKey | null> {
    const apk = await this.repository.findOne({
      where: { userId, id }
    });

    return apk || null;
  }

  async create(userId: string, data: ICreateApiKey): Promise<IApiKeyWithKey> {
    // Ensure user exists
    await this.users.getLocal(userId);

    // Create new api key
    let apk = this.repository.create({
      ...data,
      userId
    });

    // Generate key
    const key = crypto.randomBytes(60).toString('base64');
    apk.key = await bcrypt.hash(key, 10);

    apk = await this.repository.save(apk);
    return { ...apk, key };
  }

  async list(userId: string): Promise<ApiKey[]> {
    return await this.repository.find({
      where: { userId }
    });
  }

  async get(userId: string, id: string): Promise<ApiKey> {
    const apk = await this._get(userId, id);

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

  async update(userId: string, id: string, update: IUpdateApiKey): Promise<ApiKey> {
    const apk = await this.get(userId, id);

    // Apply update
    apk.label = update.label ?? apk.label;

    return await this.repository.save(apk);
  }

  async delete(userId: string, ids: string[]): Promise<number | null> {
    const { affected } = await this.repository.delete({ userId, id: In(ids) });
    return affected ?? null;
  }
}
