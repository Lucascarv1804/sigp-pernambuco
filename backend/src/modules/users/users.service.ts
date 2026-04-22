import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
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

    const saltRounds = 10;
    const hashedUserPassword = await bcrypt.hash(userPasswordRaw, saltRounds);

    const newUser = this.userRepository.create({
      userName,
      userEmail,
      userPassword: hashedUserPassword,
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