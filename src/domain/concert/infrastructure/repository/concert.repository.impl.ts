import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ConcertRepository } from '../../domain/repository/concertRepository';
import ConcertEntity from '../entity/concert.typeorm.entity';
import { ConcertMapper } from '../mapper/concert.mapper';

@Injectable()
export class ConcertRepositoryImpl implements ConcertRepository {
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async findOne(id: number): Promise<ConcertEntity> {
    const entity = await this.manager.findOne(ConcertEntity, { where: { id } });
    return ConcertMapper.toDomain(entity);
  }
}
