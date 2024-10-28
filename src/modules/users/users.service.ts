import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  createSuperAdmin(superAdminData: CreateSuperAdminDto) {
    return this.usersRepository.createSuperAdmin(superAdminData);
  }

  createAdmin(adminData: CreateAdminDto) {
    return this.usersRepository.createAdmin(adminData);
  }

  checkIfSuperAdminExists() {
    return this.usersRepository.findSuperAdmin();
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
