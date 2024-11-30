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
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from '../auth/enum/roles.enum';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('admin')
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  createAdmin(@Body() adminData: CreateAdminDto) {
    return this.usersService.createAdmin(adminData);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
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
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateData);
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
