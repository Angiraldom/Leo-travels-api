import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';

import { Response, Request } from 'express';

import { UserService } from '../service/user.service';
import { UpdateUserDto } from '../dto';
import { IPayloadToken } from 'src/core/auth/interface/IPayloadToken.interface';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { HttpExceptionFilter } from 'src/http-exception/http-exception.filter';
import { Public } from 'src/core/auth/decorators/public.decorator';


@UseFilters(HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
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
   * Controller of the method findUserById.
   */
  @Get('getProfile')
  async findUserById(@Req() req: Request) {
    const user = req.user as IPayloadToken;
    return this.userService.findUserById(user.sub);
  }

  /**
   * Controller of the method send mail when forgots password.
   */
  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.userService.sendEmail(email);
  }

  /**
   * Controller of the method recovery password.
   */
  @Public()
  @Post('recovery-password')
  async recoveryPassword(@Body() body: { password: string; token: string }) {
    return this.userService.recoveryPassword(body.password, body.token);
  }

    /**
   * Controller of the method change password.
   */
    @Public()
    @Post('change-password/:id')
    async changePassword(@Body() body: { actualPassword: string; newPassword: string }, @Param("id") id: string) {
      return this.userService.changePassword(body.actualPassword, body.newPassword, id);
    }
}
