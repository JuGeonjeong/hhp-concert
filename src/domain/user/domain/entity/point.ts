export class Point {
  userId: number;
  amount: number;

  constructor(args: { userId: number; amount: number }) {
    this.userId = args.userId;
    this.amount = args.amount;
  }
  // getBalance(): number {
  //   return this.amount;
  // }

  // charge(amount: number): void {
  //   this.amount += amount;
  // }

  // use(amount: number): void {
  //   if (this.balance < amount) {
  //     throw new BadRequestException400('잔액이 부족합니다.');
  //   }
  //   this.balance -= amount;
  // }
}
