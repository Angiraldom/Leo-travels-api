import { Injectable } from '@nestjs/common';
import { UserService } from 'src/core/user/service/user.service';
import { comparePassword } from 'src/shared/function/encryptPassword.function';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

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
}
