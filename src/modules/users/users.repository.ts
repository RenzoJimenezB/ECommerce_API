import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UserRole } from '../auth/enum/roles.enum';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async createSuperAdmin(superAdminData: CreateSuperAdminDto): Promise<User> {
    return this.repository.save({
      ...superAdminData,
      password: await bcrypt.hash(superAdminData.password, 10),
      role: UserRole.SUPERADMIN,
    });
  }

  async createAdmin(
    adminData: Omit<CreateAdminDto, 'passwordConfirmation'>,
  ): Promise<User> {
    return this.repository.save({
      ...adminData,
      password: await bcrypt.hash(adminData.password, 10),
      role: UserRole.ADMIN,
    });
  }

  async createUser(
    userData: Omit<CreateUserDto, 'passwordConfirmation'>,
  ): Promise<User> {
    return this.repository.save(userData);
  }

  async findSuperAdmin(): Promise<boolean> {
    const superAdmin = await this.repository.findOne({
      where: { role: UserRole.SUPERADMIN },
    });

    return !!superAdmin;
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

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.repository.findOneBy({ email });
  }

  async update(id: string, updateData: UpdateUserDto): Promise<User> {
    if (Object.keys(updateData).length === 0)
      throw new BadRequestException('No update data provided');

    await this.repository.update(id, updateData);

    const updatedUser = await this.repository.findOneBy({ id });

    console.log(`User with ID ${id} has been updated`);
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    const deleteResult = await this.repository.delete(id);
    console.log(
      `User with ID ${id} has been deleted: ${deleteResult.affected} record(s) affected`,
    );

    // return deleteResult;
  }
}
