import { Injectable } from '@nestjs/common';

import { UserService } from '../../../core/user/service/user.service';
import { JwtMethodsService } from '../../../shared/service/jwt-methods.service';
import { LoginDto } from '../dto/login.dto';
import {
  buildResponseFail,
  buildResponseSuccess,
} from '../../../shared/utils/utilities/Response.util';
import { validateAction } from '../../../shared/function/validateAction.function';
import { comparePassword } from '../../../shared/function/encryptPassword.function';
import { IRequestResponse } from '../../../shared/utils/interface/IRequestResponse.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtMethodService: JwtMethodsService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Method responsible for login.
   * @param {LoginDto} loginDto - Credentials user.
   * @param {string} ipAddress - IP from where the request is carried out.
   * @param {string} agent - Device from where the application is made.
   * @returns {Promise<IRequestResponse>} - Response method.
   */
  async login(
    loginDto: LoginDto,
    ipAddress: string,
    agent: string,
  ): Promise<IRequestResponse> {
    try {
      const { email, password } = loginDto;

      //Verify exist user(email)
      const EXIST_USER = await this.userService.findUser(
        { email },
        { _id: 1, password: 1, rol: 1, email: 1, status: 1 },
      );

      await validateAction(
        true,
        EXIST_USER === null || EXIST_USER.status === false,
        'User not found or disabled.',
      );

      //Compare password
      await validateAction(
        false,
        await comparePassword(password, EXIST_USER['password']),
        'The password provided by the user is wrong.',
      );

      //Create jwtToken
      const TOKEN = this.jwtMethodService.buildJwtToken({
        _id: EXIST_USER._id,
        email: EXIST_USER.email,
        rol: EXIST_USER.rol,
        agent,
        ipAddress,
      });

      //Return jwt for user.
      return buildResponseSuccess({
        data: TOKEN,
      });
    } catch (error) {
      return buildResponseFail({
        msg: error.message,
        state: false,
      });
    }
  }

  /**
   * Function to establish a new expiration time of the Token.
   * @param {string} token - Jwt token user.
   * @returns {Promise<IRequestResponse>} - Response method.
   */
  async reloadToken(token: string): Promise<IRequestResponse> {
    try {
      //Extract data token request.
      const OLD_TOKEN = await this.jwtMethodService.extractDataToken(token);

      await validateAction(
        true,
        OLD_TOKEN === null,
        'The supplied token is invalid.',
      );

      // Calculate 24 hours from the expiration of the token received.
      const EXPIRATION_IN_TIMESTAMP = OLD_TOKEN.exp + 24 * 60 * 60 * 1000;

      // Delete expiration token old to avoid mistakes.
      delete OLD_TOKEN.exp;

      // Create a new token
      const NEW_TOKEN = this.jwtService.sign(OLD_TOKEN, {
        expiresIn: EXPIRATION_IN_TIMESTAMP,
      });

      return buildResponseSuccess({
        data: {
          newToken: NEW_TOKEN,
        },
      });
    } catch (error) {
      return buildResponseFail({
        msg: error.message,
        state: false,
      });
    }
  }

  /**
   * Function that takes a token and assigns it to an invalid key to cancel it. And Response with an invalid token.
   * @param {string} token - Jwt token user.
   * @returns {Promise<IRequestResponse>} - Response method.
   */
  async logout(token: string): Promise<IRequestResponse> {
    try {
      //Extract data token
      const DATA_TOKEN = await this.jwtMethodService.extractDataToken(token);

      //Validate token
      await validateAction(
        true,
        DATA_TOKEN === null,
        'The supplied token is invalid.',
      );

      //Assign information to an invalidate key.
      const INVALID_TOKEN = this.jwtMethodService.buildInvalidToken(DATA_TOKEN);

      return buildResponseSuccess({
        data: {
          tokenInvalid: INVALID_TOKEN,
        },
      });
    } catch (error) {
      return buildResponseFail({
        msg: error.message,
        state: false,
      });
    }
  }
}
