import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { PublicUserDto } from '../users/dto/public-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(userData: CreateUserDto): Promise<PublicUserDto> {
    const dbUser = await this.usersRepository.findByEmail(userData.email);
    if (dbUser) throw new BadRequestException('Email already exists');

    const { passwordConfirmation, ...filteredData } = userData;

    const newUser = this.usersRepository.createUser({
      ...filteredData,
      password: await bcrypt.hash(userData.password, 10),
    });

    return plainToInstance(PublicUserDto, newUser);
  }

  async signIn(email: string, password: string): Promise<object> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) throw new BadRequestException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new BadRequestException('Invalid credentials');

    const userPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    console.log({ userPayload });

    const token = this.jwtService.sign(userPayload);

    return {
      message: `El usuario ${user.id} ha iniciado sesión`,
      role: userPayload.role,
      token,
    };
  }
}
