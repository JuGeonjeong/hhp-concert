import { Seat } from './seat';

export class Schedule {
  id: number;
  concertId: number;
  date: Date;
  seats: Seat[];
  maximum: number;
  count: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(args: {
    id?: number;
    concertId: number;
    date: Date;
    seats?: Seat[];
    maximum: number;
    count?: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  }) {
    this.id = args.id;
    this.concertId = args.concertId;
    this.date = args.date;
    this.seats = args.seats || [];
    this.maximum = args.maximum;
    this.count = args.count || 0;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }
  reserveSeat(): void {
    this.count += 1;
  }

  releaseSeat(): void {
    this.count -= 1;
  }

  getAvailableSeats(): void {
    this.seats = this.seats.filter((seat) => !seat.isReserved);
  }
}
