import { UserRole } from 'src/utils/constants';

export class CreateUserDto {
  username: string;
  password: string;
  role: UserRole;
}
