export const QueueFacade = Symbol('QueueFacade');
/**
 * @interface
 * @implements {QueueFacadeImpl.createToken}
 */
export interface QueueFacade {
  createToken(): Promise<any>;
  checkToken(aggregate: any): Promise<any>;
  outToken(aggregate: any): Promise<any>;
}
