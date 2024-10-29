import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Role } from 'src/decorators/roles.decorator';
import { UserRole } from '../auth/enum/roles.enum';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PublicUserDto } from './dto/public-user.dto';
import { User } from './entities/user.entity';
import { DeleteResult } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('admin')
  @HttpCode(HttpStatus.CREATED)
  @Role(UserRole.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  createAdmin(@Body() adminData: CreateAdminDto) {
    return this.usersService.createAdmin(adminData);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: Request & { user: any },
  ) {
    const requestingUserId = request.user.sub;
    const requestingUserRole = request.user.role;
    return this.usersService.findOne(id, requestingUserId, requestingUserRole);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: Request & { user: any },
  ) {
    const requestingUserId = request.user.sub;
    return this.usersService.remove(id, requestingUserId);
  }
}
