import { Concert } from '../entity/concert';

export interface ConcertRepository {
  findOne(id: number): Promise<Concert>;
}
