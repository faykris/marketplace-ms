import { UserRole } from 'src/utils/constants';

export class UpdateUserDto {
  username: string;
  password: string;
  role: UserRole;
}
