import { Body, Controller, Get, Post, Res } from '@nestjs/common';

import { Response } from 'express';

import { UserService } from '../service/user.service';
import { AddUserDto, DeleteUserDto, UpdateUserDto } from '../dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Controller of the method getAllUsers.
   */
  @Get('all')
  async getAllUsers(@Res() res: Response) {
    try {
      const RESPONSE = await this.userService.getAllUsers();
      return res.status(RESPONSE['code']).json(RESPONSE);
    } catch (error) {
      console.log('Error método: getAllUsers');
      return res.status(400).json(error);
    }
  }

  /**
   * Controller of the method addUser.
   */
  @Post('add')
  async addUser(@Body() user: AddUserDto, @Res() res: Response) {
    try {
      const RESPONSE = await this.userService.addUser(user);
      return res.status(RESPONSE['code']).json(RESPONSE);
    } catch (error) {
      console.log('Error método: addUser');
      return res.status(400).json(error);
    }
  }

  /**
   * Controller of the method updateUser.
   */
  @Post('update')
  async updateUser(@Body() userToUpdate: UpdateUserDto, @Res() res: Response) {
    try {
      const RESPONSE = await this.userService.updateUser(userToUpdate);
      return res.status(RESPONSE['code']).json(RESPONSE);
    } catch (error) {
      console.log('Error método: updateUser');
      return res.status(400).json(error);
    }
  }

  /**
   * Controller of the method deleteUSer.
   */
  @Post('delete')
  async deleteUSer(@Body() userToDelete: DeleteUserDto, @Res() res: Response) {
    try {
      const RESPONSE = await this.userService.deleteUser(userToDelete);
      return res.status(RESPONSE['code']).json(RESPONSE);
    } catch (error) {
      console.log('Error método: updateUser');
      return res.status(400).json(error);
    }
  }
}
