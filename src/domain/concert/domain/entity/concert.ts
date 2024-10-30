export class Concert {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(args: Concert) {
    this.id = args.id;
    this.name = args.name;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }
}
