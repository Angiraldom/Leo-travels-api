import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';

import { IPayloadToken } from '../interface/IPayloadToken.interface';
import config from 'src/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(config.KEY) configService: ConfigType<typeof config>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.jwtSecret,
      ignoreExpiration: true,
    });
  }

  async validate(token: IPayloadToken) {
    const currenDate = new Date().getTime() / 1000;
    const tokenExpired = token.exp > currenDate;

    if (!tokenExpired) {
      throw new UnauthorizedException({
        customMessage: 'El token a expirado, inicie sesión nuevamente',
        tag: 'ErrorTokenExpired',
      });
    }
    return token;
  }
}
