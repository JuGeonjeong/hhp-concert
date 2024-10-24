import { ApiProperty } from '@nestjs/swagger';
import Queue from '../../domain/queue.entity';

export class ResTokenDto {
  @ApiProperty({ description: 'uuid' })
  uuid: string;

  @ApiProperty({ description: '생성시간' })
  createdAt: Date;

  //   @ApiProperty({ description: '대기인원수' })
  //   waitingCount: number;

  //   @ApiProperty({ description: '대기시간(분)' })
  //   waitingTime: number;

  constructor(queue: Queue) {
    this.uuid = queue.uuid;
    this.createdAt = queue.createdAt;
    // this.waitingCount = waitingCount;
    // this.waitingTime = waitingTime;
  }
}
