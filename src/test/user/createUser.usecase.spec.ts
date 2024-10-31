import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUsecase } from '../../domain/user/application/usecase/createUser.usecase';
import { UserService } from '../../domain/user/application/service/user.service';
import { CreateUserDto } from '../../domain/user/interface/dto/req/createUser.dto';
import UserEntity from 'src/domain/user/infrastructure/entity/user.entity';

describe('CreateUserUsecase', () => {
  let createUserUsecase: CreateUserUsecase;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUsecase,
        {
          provide: UserService,
          useValue: {
            isEmailTaken: jest.fn(),
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    createUserUsecase = module.get<CreateUserUsecase>(CreateUserUsecase);
    userService = module.get<UserService>(UserService);
  });

  it('', () => {
    expect(createUserUsecase).toBeDefined();
  });

  describe('execute', () => {
    it('유저를 생성해야 한다.', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
      };
      const createdUser = new UserEntity();
      jest.spyOn(userService, 'createUser').mockResolvedValue(createdUser);

      const result = await createUserUsecase.execute(createUserDto);

      expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createdUser);
    });
  });
});
