import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { plainToInstance } from 'class-transformer';
import { PublicUserDto } from './dto/public-user.dto';
import { User } from './entities/user.entity';
import { DeleteResult } from 'typeorm';
import { UserRole } from '../auth/enum/roles.enum';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  createSuperAdmin(superAdminData: CreateSuperAdminDto): Promise<User> {
    return this.usersRepository.createSuperAdmin(superAdminData);
  }

  async createAdmin(adminData: CreateAdminDto): Promise<PublicUserDto> {
    const dbAdmin = await this.usersRepository.findByEmail(adminData.email);
    if (dbAdmin) throw new BadRequestException('Email already exists');

    const { passwordConfirmation, ...filteredData } = adminData;
    const newAdmin = await this.usersRepository.createAdmin(filteredData);

    return plainToInstance(PublicUserDto, newAdmin);
  }

  checkIfSuperAdminExists(): Promise<boolean> {
    return this.usersRepository.findSuperAdmin();
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findOne(
    id: string,
    requestingUserId: string,
    requestingUserRole: UserRole,
  ): Promise<PublicUserDto> {
    const user = await this.usersRepository.findById(id);
    console.log(user);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (
      id !== requestingUserId &&
      ![UserRole.SUPERADMIN, UserRole.ADMIN].includes(requestingUserRole)
    ) {
      throw new ForbiddenException('You can only access your own account');
    }

    return plainToInstance(PublicUserDto, user);
  }

  update(id: string, updateData: UpdateUserDto): Promise<User> {
    return this.usersRepository.update(id, updateData);
  }

  async remove(id: string, requestingUserId: string): Promise<DeleteResult> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    if (id !== requestingUserId)
      throw new ForbiddenException('You can only delete your own account');

    return this.usersRepository.delete(id);
  }
}
