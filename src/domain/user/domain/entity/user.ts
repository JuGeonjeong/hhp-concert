export class User {
  id: number;
  name: string;
  email: string;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(args: {
    id: number;
    name: string;
    email: string;
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
  }) {
    this.id = args.id;
    this.name = args.name;
    this.email = args.email;
    this.uuid = args.uuid;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }
}
