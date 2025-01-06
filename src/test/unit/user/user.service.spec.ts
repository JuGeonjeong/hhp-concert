import { UserService } from '../../../domain/user/domain/service/user.service';
import { UserRepository } from '../../../domain/user/domain/repository/userRepository';
import { User } from '../../../../src/domain/user/domain/entity/user';
import { CreateUserDto } from 'src/domain/user/interface/dto/req/createUser.dto';
import { NotFoundException404 } from 'src/common/exception/not.found.exception.404';

describe('UserService unit test', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    // Mock UserRepository 생성
    mockUserRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    // UserService 인스턴스 생성
    userService = new UserService(mockUserRepository);
  });

  it('UserService가 정의되어 있어야 한다.', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    // 성공케이스: 사용자 생성
    it('사용자를 생성하고 사용자정보를 반환한다.', async () => {
      const body: CreateUserDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
      };
      const createdUser = new User({
        id: 1,
        name: body.name,
        email: body.email,
        uuid: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockUserRepository.create.mockResolvedValue(createdUser);

      const result = await userService.createUser(body);
      expect(result).toEqual(createdUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(body);
    });
    // 실패케이스: 사용자 생성 후 리턴값이 올바르지 않은 경우
    it('Mock된 값이 다를 경우 테스트를 실패한다.', async () => {
      const body: CreateUserDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
      };

      const createdUser = new User({
        id: 1,
        name: 'Incorrect Name',
        email: body.email,
        uuid: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockUserRepository.create.mockResolvedValue(createdUser);

      const result = await userService.createUser(body);
      expect(result.getName()).not.toBe(body.name);
      expect(result.getName()).toBe('Incorrect Name');
      expect(result.getEmail()).toBe(body.email);
      expect(result.getId()).toBe(createdUser.getId());
      expect(mockUserRepository.create).toHaveBeenCalledWith(body);
    });
  });

  describe('findOne', () => {
    // 성공케이스: 올바른 호출
    it('userId의 올바른 사용자를 찾아야 한다.', async () => {
      const userId = 2;
      const userMock = new User({
        id: userId,
        name: '주건정',
        email: 'wnrjswjd@naver.com',
        uuid: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockUserRepository.findOne.mockResolvedValue(userMock);
      const result = await userService.findOne(userId);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith(userId);
      expect(result).toEqual(userMock);
    });
    // 실패케이스: 없는 유저 조회
    it('존재하지 않는 유저 조회시 에러를 반환해야 한다.', async () => {
      const userId = 99999;
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(userService.findOne(userId)).rejects.toThrow(
        new NotFoundException404(`없는 유저 입니다. id: ${userId}`),
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith(userId);
    });
  });
});
