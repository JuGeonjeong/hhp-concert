export class Point {
  id: number;
  userId: number;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(args: {
    id?: number;
    userId: number;
    amount: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }) {
    this.id = args.id;
    this.userId = args.userId;
    this.amount = args.amount;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }
  // getBalance(): number {
  //   return this.amount;
  // }

  // charge(amount: number): void {
  //   this.amount += amount;
  // }

  // use(amount: number): void {
  //   if (this.balance < amount) {
  //     throw new Error('잔액이 부족합니다.');
  //   }
  //   this.balance -= amount;
  // }
}
