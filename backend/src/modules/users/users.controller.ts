import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async registerNewUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.createNewUser(
      createUserDto.userName,
      createUserDto.userEmail,
      createUserDto.userPasswordRaw,
      createUserDto.userRole,
    );
  }
}