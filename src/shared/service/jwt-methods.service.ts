import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from '../interface/IJwtPayload.interface';

@Injectable()
export class JwtMethodsService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Function in charge of generating the jwt token.
   * @param {IJwtPayload} payload - Data object that goes in the jwt.
   * @returns {string} - Jwt token.
   */
  buildJwtToken(payload: IJwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_TOKEN,
      expiresIn: '6h',
    });
  }

  /**
   * Function in charge of generating the jwt token invalid.
   * @param {IJwtPayload} payload - Data object that goes in the jwt.
   * @returns {string} - Jwt token with secret incorrect.
   */
  buildInvalidToken(payload: IJwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_TOKEN_INVALID,
    });
  }

  /**
   * Function in charge to extract the data from the token.
   * @param {string} token - Token extracted from user http header.
   * @returns {Promise<IJwtPayload>} - Token data.
   */
  extractDataToken(token: string): Promise<IJwtPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_TOKEN,
      ignoreExpiration: false,
    });
  }
}
