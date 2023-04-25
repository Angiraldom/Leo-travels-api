import { Body, Controller, Get, Post } from '@nestjs/common';

import { UserService } from '../service/user.service';
import { AddUserDto, DeleteUserDto, UpdateUserDto } from '../dto';
import { IRequestResponse } from '../../../shared/utils/interface/IRequestResponse.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Controller of the method getAllUsers.
   */
  @Get('all')
  async getAllUsers(): Promise<IRequestResponse> {
    return await this.userService.getAllUsers();
  }

  /**
   * Controller of the method addUser.
   */
  @Post('add')
  async addUser(@Body() user: AddUserDto): Promise<IRequestResponse> {
    return await this.userService.addUser(user);
  }

  /**
   * Controller of the method updateUser.
   */
  @Post('update')
  async updateUser(
    @Body() userToUpdate: UpdateUserDto,
  ): Promise<IRequestResponse> {
    return await this.userService.updateUser(userToUpdate);
  }

  /**
   * Controller of the method deleteUSer.
   */
  @Post('delete')
  async deleteUSer(
    @Body() userToDelete: DeleteUserDto,
  ): Promise<IRequestResponse> {
    return await this.userService.deleteUser(userToDelete);
  }
}
