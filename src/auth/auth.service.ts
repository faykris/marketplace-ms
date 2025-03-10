import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from 'src/auth/dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users/users.service';
import { UserWithoutPassword } from 'src/utils/types';
import { UserRole } from 'src/utils/constants';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser({ username, password }: AuthPayloadDto): Promise<{
    token: string;
    id: number;
    role: UserRole;
  } | null> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = this.jwtService.sign(userWithoutPassword);

    return { token, id: user.id, role: user.role };
  }

  signUser(user: UserWithoutPassword) {
    return this.jwtService.sign(user);
  }
}
