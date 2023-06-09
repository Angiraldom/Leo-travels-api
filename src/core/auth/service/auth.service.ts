import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { IUser } from 'src/core/user/interface/IUser.interface';
import { UserService } from 'src/core/user/service/user.service';
import { comparePassword } from 'src/shared/function/encryptPassword.function';
import { IPayloadToken } from '../interface/IPayloadToken.interface';
import { buildResponseSuccess } from 'src/shared/utils/utilities/Response.util';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * Compare that the passwords are the same.
   * @param email Value to search.
   * @param password Value to compare.
   * @returns { user } The user.
   */
  async validateUSer(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      // The user doesn't exist.
      return null;
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      // The password is incorrect.
      return null;
    }
    delete user.password;
    return user;
  }

  /**
   * Generate a token with the user data.
   * @param user Data user.
   * @returns The token and user data.
   */
  generateJWT(user: IUser) {
    const payload: IPayloadToken = { role: user.role, sub: user._id };
    const response = buildResponseSuccess({
      data: {
        access_token: this.jwtService.sign(payload),
        user,
      },
    });
    return response;
  }
}
