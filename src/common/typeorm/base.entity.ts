import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntities {
  @PrimaryGeneratedColumn({ type: 'int', comment: '고유키' })
  id: number;

  @CreateDateColumn({ type: 'datetime', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '수정일' })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'datetime',
    comment: '삭제일',
    nullable: true,
    default: null,
  })
  deletedAt: Date | null;
}
