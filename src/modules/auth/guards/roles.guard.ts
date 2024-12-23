import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRole } from '../enum/roles.enum';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    console.log(`required roles: ${requiredRoles}`);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log(`user role: ${user.role}`);

    const hasRole = () =>
      requiredRoles.some((role) => user?.role?.includes(role));

    if (!hasRole()) {
      throw new ForbiddenException(
        'You do not have permission and are not allowed to access this route',
      );
    }

    return true;
  }
}
