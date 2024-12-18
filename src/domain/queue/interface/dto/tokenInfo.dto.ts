import { ApiProperty } from '@nestjs/swagger';

export class TokenInfo {
  @ApiProperty({ description: '대기인원수' })
  readonly waitingCount: number;

  @ApiProperty({ description: '대기시간(분)' })
  readonly waitingTime: number;

  constructor(queue: any) {
    this.waitingCount = queue.waitingCount;
    this.waitingTime = queue.waitingTime;
  }
}
