import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async createAdmin(user: CreateUserDto): Promise<User> {
    return this.repository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  async findById(id: string, manager?: EntityManager): Promise<User> {
    const repository = manager ? manager.getRepository(User) : this.repository;

    const user = await repository.findOne({
      where: { id },
      relations: { orders: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.repository.findOneBy({ email });
  }

  async update(id: string, updateData: UpdateUserDto) {
    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('No update data provided');
    }

    await this.repository.update(id, updateData);

    const updatedUser = await this.repository.findOneBy({ id });

    console.log(`User with ID ${id} has been updated`);
    return updatedUser;
  }

  async delete(id: string) {
    return `User with ID ${id} has been deleted`;
  }
}
