import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from 'src/domain/payment/domain/service/payment.service';
// import { PaymentRepository } from '../domain/repository/payment.repository';

describe('PaymentService', () => {
  let paymentService: PaymentService;
  // let paymentRepository: PaymentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: 'IPaymentRepository', // Mock the PaymentRepository
          useValue: {
            create: jest.fn(), // Mock the create function
          },
        },
      ],
    }).compile();

    paymentService = module.get<PaymentService>(PaymentService);
    // paymentRepository = module.get<PaymentRepository>('IPaymentRepository');
  });

  it('', () => {
    expect(paymentService).toBeDefined();
  });

  describe('create', () => {
    // it('결제가 성공적으로 생성되어야 한다', async () => {
    //   const userId = 1;
    //   const seatId = 4;
    //   const mockPayment = {
    //     id,
    //     userId,
    //     seatId,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //     deletedAt: null,
    //   };
    //   jest.spyOn(paymentRepository, 'create').mockResolvedValue(mockPayment);
    //   const result = await paymentService.create(userId, seatId);
    //   expect(paymentRepository.create).toHaveBeenCalledWith(userId, seatId);
    //   expect(result).toEqual(mockPayment);
    // });
  });
});
