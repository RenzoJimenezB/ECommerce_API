import { OmitType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';

export class CreateSuperAdminDto extends OmitType(CreateAdminDto, [
  'country',
  'city',
  'passwordConfirmation',
]) {}
