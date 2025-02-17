import { ConcertService } from 'src/domain/concert/domain/service/concert.service';
import { PaymentEventPublisher } from 'src/domain/payment/application/event/paymentEventPublisher';
import { PaymentRepository } from 'src/domain/payment/domain/repository/payment.repository';
import { PaymentService } from 'src/domain/payment/domain/service/payment.service';
import { PointService } from 'src/domain/user/domain/service/point.service';
import { UserService } from 'src/domain/user/domain/service/user.service';
import { DataSource } from 'typeorm';

describe('PaymentService unit test', () => {
  //   let paymentService: PaymentService;
  //   let mockPaymentRepository: jest.Mocked<PaymentRepository>;
  //   let mockConcertService: jest.Mocked<ConcertService>;
  //   let mockUserService: jest.Mocked<UserService>;
  //   let mockPointService: jest.Mocked<PointService>;
  //   let mockPaymentEventPublisher: jest.Mocked<PaymentEventPublisher>;
  //   beforeEach(() => {
  //     mockPaymentRepository = {
  //       create: jest.fn(),
  //       findOne: jest.fn(),
  //       save: jest.fn(),
  //     } as unknown as jest.Mocked<PaymentRepository>;
  //     mockConcertService = {
  //       findOne: jest.fn(),
  //       update: jest.fn(),
  //     } as unknown as jest.Mocked<ConcertService>;
  //     paymentService = new PaymentService(
  //       mockPaymentRepository,
  //       mockPaymentEventPublisher,
  //       mockUserService,
  //       mockPointService,
  //       mockConcertService,
  //     );
  //     afterEach(() => {
  //       jest.clearAllMocks();
  //     });
  //     it('ConcertService가 정의되어 있어야 한다.', () => {
  //       expect(paymentService).toBeDefined();
  //     });
  //   });
});
