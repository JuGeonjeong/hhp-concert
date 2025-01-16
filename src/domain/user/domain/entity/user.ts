import { BadRequestException400 } from 'src/common/exception/bad.request.exception.400';

export class User {
  private readonly id: number;
  private name: string;
  private readonly email: string;
  private readonly uuid: string;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(args: {
    id: number;
    name: string;
    email: string;
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = args.id;
    this.name = args.name;
    this.email = args.email;
    this.uuid = args.uuid;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;

    this.validateEmail(args.email);
    this.validateName(args.name);
  }

  // Getter for ID (읽기 전용)
  getId(): number {
    return this.id;
  }

  // Getter for Email (읽기 전용)
  getEmail(): string {
    return this.email;
  }

  // Getter for Name
  getName(): string {
    return this.name;
  }

  // Setter for Name (비즈니스 규칙 추가 가능)
  changeName(newName: string): void {
    this.validateName(newName);
    this.name = newName;
    this.updateTimestamp();
  }

  // 비즈니스 로직: 이름 유효성 검사
  private validateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new BadRequestException400('이름은 최소 세글자 이상이어야 합니다.');
    }
  }

  // Getter for UUID
  getUuid(): string {
    return this.uuid;
  }

  // 업데이트된 타임스탬프 갱신
  private updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  // 비즈니스 로직: 이메일 유효성 검사
  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 간단한 이메일 형식 검증
    if (!emailRegex.test(email)) {
      throw new BadRequestException400('이메일 형식에 올바르지 않습니다.');
    }
  }
}
