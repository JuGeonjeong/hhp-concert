export const UserFacade = Symbol('UserFacade');

export interface UserFacade {
  createUser(aggregate: any): Promise<any>;
  charge(aggregate: any): Promise<any>;
  findOne(userId: any): Promise<any>;
}
