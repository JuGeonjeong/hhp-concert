import { BaseEntities } from '../../../../common/typeorm/base.entity';
import { Column, Entity } from 'typeorm';

export enum QueueStatusEnum {
  // 대기
  WAIT = 'WAIT',
  // 입장
  ENTER = 'ENTER',
  // 취소
  OUT = 'OUT',
}

@Entity({ name: 'queue' })
export default class QueueEntity extends BaseEntities {
  @Column({ unique: true, comment: '사용자전달아이디', nullable: true })
  uuid: string;

  @Column({ type: 'datetime', nullable: true, comment: '입장 후 활동시간' })
  enteredAt: Date;

  //   @IsEnum(QueueStatusEnum)
  @Column({
    type: 'enum',
    enum: QueueStatusEnum,
    default: 'WAIT',
    comment: '상태',
  })
  status: QueueStatusEnum;

  // constructor(partial: Partial<Queue>) {
  //   super();
  //   Object.assign(this, partial);
  // }
}
