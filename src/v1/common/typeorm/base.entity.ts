import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntities {
  @PrimaryGeneratedColumn({ type: 'int', comment: '고유키' })
  readonly id: number;

  @CreateDateColumn({ type: 'datetime', comment: '생성일' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '수정일' })
  readonly updatedAt: Date;

  @DeleteDateColumn({
    type: 'datetime',
    comment: '삭제일',
    nullable: true,
    default: null,
  })
  readonly deletedAt: Date;
}
