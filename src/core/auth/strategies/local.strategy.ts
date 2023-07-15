import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../service/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  // Overwrite the method "validate" of "PassportStrategy"
  async validate(email: string, password: string) {
    const user = await this.authService.validateUSer(email, password);
    if (!user) {
      throw new UnauthorizedException({
        customMessage: 'Email o contraseña invalidos',
        tag: 'ErrorInvalidCredentials',
      });
    }
    return user;
  }
}
