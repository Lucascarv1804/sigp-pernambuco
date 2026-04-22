import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createNewUser(
    userName: string,
    userEmail: string,
    userPasswordRaw: string,
    userRole: UserRole = UserRole.USER,
  ): Promise<UserEntity> {
    const userAlreadyExists = await this.userRepository.findOne({
      where: { userEmail },
    });

    if (userAlreadyExists) {
      throw new ConflictException('O e-mail informado já está em uso no sistema');
    }

    const newUser = this.userRepository.create({
      userName,
      userEmail,
      userPassword: userPasswordRaw,
      userRole,
    });

    return this.userRepository.save(newUser);
  }

  async findUserByEmail(userEmail: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { userEmail },
      select: ['userId', 'userEmail', 'userPassword', 'userRole', 'userName'],
    });
  }
}