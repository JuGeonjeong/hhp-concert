export class Concert {
  readonly id: number;
  name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  deletedAt: Date;

  constructor(args: {
    id?: number;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }) {
    this.id = args.id;
    this.name = args.name;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }

  // 삭제 처리
  delete(): void {
    if (this.deletedAt) {
      throw new Error('이미 삭제된 콘서트입니다.');
    }
    this.deletedAt = new Date();
  }

  // 이름 변경
  changeName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('유효하지 않은 이름입니다.');
    }
    this.name = newName;
  }
}
