import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { Request } from 'express';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('login')
  @UseGuards(LocalGuard)
  login(@Req() req: Request) {
    return req.user;
  }

  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.userService.createUser(createUserDto);

    const { password: _, ...userWithoutPassword } = createdUser;

    const token = this.authService.signUser(userWithoutPassword);

    return { ...userWithoutPassword, token };
  }

  @Get('status')
  @UseGuards(JwtGuard)
  status(@Req() req: Request) {
    return req.user;
  }
}
