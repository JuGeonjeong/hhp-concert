import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../domain/user/application/service/user.service';
import { UserRepository } from '../../domain/user/domain/repository/userRepository';
import UserEntity from 'src/domain/user/infrastructure/entity/user.entity';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  // 매 테스트 전에 실행되는 부분
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'IUserRepository',
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            existsByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>('IUserRepository');
  });

  // 서비스가 정상적으로 정의되었는지 확인
  it('UserService가 정의되어 있어야 한다.', () => {
    expect(userService).toBeDefined();
  });

  // createUser 메서드 테스트
  describe('createUser', () => {
    it('사용자를 생성해야 한다.', async () => {
      const userDto = { email: 'test@example.com' };
      const createdUser = new UserEntity();
      jest.spyOn(userRepository, 'create').mockResolvedValue(createdUser);

      const result = await userService.createUser(userDto);

      expect(userRepository.create).toHaveBeenCalledWith(userDto);
      expect(result).toEqual(createdUser);
    });
  });

  // findOne 메서드 테스트
  describe('findOne', () => {
    it('사용자를 찾아야 한다.', async () => {
      const userId = 1;
      const foundUser = new UserEntity();
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(foundUser);

      const result = await userService.findOne(userId);

      expect(userRepository.findOne).toHaveBeenCalledWith(userId);
      expect(result).toEqual(foundUser);
    });
  });
});
