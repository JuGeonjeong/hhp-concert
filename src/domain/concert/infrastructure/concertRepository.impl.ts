import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ConcertRepository } from '../domain/repository/concertRepository';
import Concert from '../domain/entity/concert.entity';

@Injectable()
export class ConcertRepositoryImpl implements ConcertRepository {
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async findOne(id: number): Promise<Concert> {
    return await this.manager.findOne(Concert, { where: { id } });
  }
}
