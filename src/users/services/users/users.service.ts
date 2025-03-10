import * as bcrypt from 'bcrypt';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import { CreateUserParams, UpdateUserParams } from 'src/utils/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  findUserById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  fetchUsers() {
    return this.userRepository.find();
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

  updateUser(id: number, userDetails: UpdateUserParams) {
    return this.userRepository.update({ id }, { ...userDetails });
  }

  deleteUser(id: number) {
    return this.userRepository.delete({ id });
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({
      where: { username },
    });
  }
}
