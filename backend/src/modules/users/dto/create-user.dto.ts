import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  userName: string;
  userEmail: string;
  userPasswordRaw: string;
  userRole?: UserRole;
}