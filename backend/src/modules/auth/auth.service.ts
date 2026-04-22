import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(userEmail: string, userPasswordRaw: string) {
    const user = await this.usersService.findUserByEmail(userEmail);

    if (!user || !user.userPassword) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(userPasswordRaw, user.userPassword);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { 
      sub: user.userId, 
      email: user.userEmail, 
      role: user.userRole 
    };

    return {
      access_token: this.jwtService.sign(payload),
      userName: user.userName,
      userRole: user.userRole,
    };
  }
}