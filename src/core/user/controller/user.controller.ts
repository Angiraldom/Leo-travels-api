import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
import { IUser } from '../interface/IUser.interface';
import { UpdateClassDto } from 'src/core/course/dto/class.dto';


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
      return res.status(400).json(error);
    }
  }

  /**
   * Filter user by email.
   * @param data Email to search.
   * @returns The user.
   */
  @Public()
  @Post('findByEmail')
  getInvoiceByEmail(@Body() data: { email: string }) {
   return this.userService.findByEmail(data.email);
  }

  @Post('add')
  async addUser(@Body() user: IUser){
    return this.userService.addUser(user);
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
  @Post('change-password/:id')
  async changePassword(@Body() body: { actualPassword: string; newPassword: string }, @Param("id") id: string) {
    return this.userService.changePassword(body.actualPassword, body.newPassword, id);
  }

  @Patch('completedClass/:idCourse/:idModule/:idClass')
  completedClass(
    @Param('idCourse') course: string, 
    @Param('idModule') module: string, 
    @Param('idClass') idClass: string, 
    @Body() data: UpdateClassDto,
    @Req() req: Request
    ) {
    const body: any = data;
    const user = req.user as IPayloadToken;
    return this.userService.updateClass(course, module, idClass, user.sub ,body);
  }

  @Public()
  @Post('clase-gratis')
  async freeClassEmail(
    @Body() data,
  ) {
    return await this.userService.sendEmailFreeClass(data);
  }
}
