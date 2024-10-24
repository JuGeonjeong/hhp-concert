import Concert from '../entity/concert.entity';

export interface ConcertRepository {
  findOne(id: number): Promise<Concert>;
}
