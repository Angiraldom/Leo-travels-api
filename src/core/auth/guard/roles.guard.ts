import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Implemetation Guard:
   * @UseGuards(RolesGuard)
   * @SetMetadata('roles', ['Admin']) -> First parameter necesary "roles", Second parameter he roles accepted in that endpoint.
   */

  /**
   * Function to extract the Jwt Token from the Request.
   * @param {ExecutionContext} context
   * @returns {string} - Jwt token user.
   */
  obtainJwt(context: ExecutionContext): string {
    const REQUEST = context.switchToHttp().getRequest();
    return REQUEST.headers?.authorization?.replace('Bearer ', '');
  }

  canActivate(context: ExecutionContext): boolean {
    const REQUIRED_ROLES = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    // If there are no defined roles, it allows access
    if (!REQUIRED_ROLES) return true;

    // Obtain token.
    const JWT_TOKEN = this.obtainJwt(context);

    // Check that the Token exists, if access is not denied.
    if (!JWT_TOKEN) return false;

    try {
      const { rol } = this.jwtService.verify(JWT_TOKEN);

      // Verify that the user has the allowed role.
      return REQUIRED_ROLES.some((role) => rol.includes(role));
    } catch (error) {
      return false;
    }
  }
}
