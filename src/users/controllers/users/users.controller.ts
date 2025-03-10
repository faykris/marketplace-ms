import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from 'src/users/services/users/users.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getUsers() {
    return this.userService.fetchUsers();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findUserById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.userService.updateUser(id, updateUserDto);

    return {
      message: 'User updated successfully',
    };
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUser(id);

    return {
      message: 'User deleted successfully',
    };
  }
}
