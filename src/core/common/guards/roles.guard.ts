import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(ctx: ExecutionContext) {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      ctx.getHandler(),
    );
    if (!requiredRoles) return false;
    const user = ctx.switchToHttp().getRequest().user;
    return requiredRoles.includes(user.role.toLowerCase());
  }
}
