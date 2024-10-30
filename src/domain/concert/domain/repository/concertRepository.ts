import Concert from '../../infrastructure/entity/concert.typeorm.entity';

export interface ConcertRepository {
  /**
   * @implements {ConcertRepositoryImpl.findOne}
   */
  findOne(id: number): Promise<Concert>;
}
