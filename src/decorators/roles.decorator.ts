import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/modules/auth/enum/roles.enum';

export const Role = (role: UserRole) => SetMetadata('role', role);
