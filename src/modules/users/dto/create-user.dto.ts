import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Length,
  MaxLength,
} from 'class-validator';
import { Match } from 'src/decorators/match.decorator';
import { UserRole } from 'src/modules/auth/enum/roles.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 25)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  passwordConfirmation: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 25)
  country: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 25)
  city: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 80)
  address: string;

  @IsEmpty()
  role: UserRole;
}
