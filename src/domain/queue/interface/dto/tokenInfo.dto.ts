import { ApiProperty } from '@nestjs/swagger';

export class TokenInfo {
  @ApiProperty({ description: 'uuid' })
  readonly uuid: string;

  @ApiProperty({ description: '대기인원수' })
  readonly waitingCount: number;

  @ApiProperty({ description: '대기시간(분)' })
  readonly waitingMin: number;

  constructor(queue: any) {
    this.uuid = queue.uuit;
    this.waitingCount = queue.waitingCount;
    this.waitingMin = queue.waitingMin;
  }
}
