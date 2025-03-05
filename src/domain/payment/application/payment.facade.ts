export const PaymentFacade = Symbol('PaymentFacade');

export interface PaymentFacade {
  create(aggregate: any): Promise<any>;
  paySeat(aggregate: any): Promise<any>;
}
