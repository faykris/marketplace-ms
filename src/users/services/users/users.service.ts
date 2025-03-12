import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import { CreateUserParams, UpdateUserParams } from 'src/utils/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findUserById(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async fetchUsers() {
    const users = await this.userRepository.find();

    return users.map(
      ({ password: _, ...userWithoutPassword }) => userWithoutPassword,
    );
  }

  async createUser(userDetails: CreateUserParams) {
    const { password, ...otherDetails } = userDetails;

    const existingUser = await this.findByUsername(userDetails.username);

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      ...otherDetails,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return this.userRepository.save(newUser);
  }

  async updateUser(id: number, userDetails: UpdateUserParams): Promise<void> {
    const result = await this.userRepository.update({ id }, { ...userDetails });
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async deleteUser(id: number): Promise<void> {
    const result = await this.userRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({
      where: { username },
    });
  }
}
