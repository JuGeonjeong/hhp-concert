import { Column, Entity, JoinColumn } from 'typeorm';
import { BaseEntities } from '../../../../common/typeorm/base.entity';

export enum HistoryStatusEnum {
  // 포인트 충전
  CHARGE = '충전',
  // 포인트 사용
  USE = '사용',
}

@Entity({ name: 'pointHistory' })
export default class PointHistoryEntity extends BaseEntities {
  @Column({ type: 'int', nullable: true })
  amount: number;

  @Column({
    type: 'enum',
    enum: HistoryStatusEnum,
    nullable: true,
  })
  diff: HistoryStatusEnum;

  @Column({ type: 'int' })
  @JoinColumn({
    name: 'userId',
    foreignKeyConstraintName: 'fk_seat_userId',
  })
  userId: number;
}
