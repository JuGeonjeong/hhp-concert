import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUsecase } from '../../domain/user/application/usecase/createUser.usecase';
import { UserService } from '../../domain/user/application/service/user.service';
import { CreateUserDto } from '../../domain/user/interface/dto/req/createUser.dto';
import User from '../../domain/user/domain/entity/user';

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
    it('이메일이 이미 사용 중일 때 에러를 던져야 한다.', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
      };
      jest.spyOn(userService, 'isEmailTaken').mockResolvedValue(true);

      await expect(createUserUsecase.execute(createUserDto)).rejects.toThrow(
        'Email is already taken',
      );
      expect(userService.isEmailTaken).toHaveBeenCalledWith(
        createUserDto.email,
      );
    });

    it('이메일이 사용 가능할 때 유저를 생성해야 한다.', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
      };
      const createdUser = new User();
      jest.spyOn(userService, 'isEmailTaken').mockResolvedValue(false);
      jest.spyOn(userService, 'createUser').mockResolvedValue(createdUser);

      const result = await createUserUsecase.execute(createUserDto);

      expect(userService.isEmailTaken).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createdUser);
    });
  });
});
