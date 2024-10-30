export class Payment {
  id: number;
  seatId: number;
  userId: number;

  constructor(args: { id?: number; seatId: number; userId: number }) {
    this.id = args.id;
    this.seatId = args.seatId;
    this.userId = args.userId;
  }
}
