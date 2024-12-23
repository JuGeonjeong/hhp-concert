import { ApiProperty } from '@nestjs/swagger';

export class ResTokenDto {
  @ApiProperty({ description: '고유키' })
  readonly id: number;

  @ApiProperty({ description: '고유키' })
  readonly uuid: string;

  @ApiProperty({ description: '생성날짜' })
  readonly createdAt: string;

  constructor(queue: any) {
    this.id = queue.id;
    this.uuid = queue.uuid;
    this.createdAt = queue.createdAt;
  }
}
