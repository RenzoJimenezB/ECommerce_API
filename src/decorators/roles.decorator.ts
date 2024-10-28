import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/modules/auth/enum/roles.enum';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
