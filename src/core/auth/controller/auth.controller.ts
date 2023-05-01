import { Controller, Body, Req, Res, Post } from '@nestjs/common';

import { Request, Response } from 'express';

import { AuthService } from '../service/auth.service';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const RESPONSE = await this.authService.login(
        loginDto,
        req['ip'],
        req.headers['user-agent'],
      );

      return res.status(RESPONSE['code']).json(RESPONSE);
    } catch (error) {
      console.log('Error método: login');
      return res.status(400).json(error);
    }
  }

  @Post('reloadToken')
  async reloadToken(@Req() req: Request, @Res() res: Response) {
    try {
      const RESPONSE = await this.authService.reloadToken(
        req.headers['authorization'].split(' ')[1],
      );
      return res.status(RESPONSE['code']).json(RESPONSE);
    } catch (error) {
      console.log('Error método: login');
      return res.status(400).json(error);
    }
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      const RESPONSE = await this.authService.logout(
        req.headers['authorization'].split(' ')[1],
      );

      return res.status(RESPONSE['code']).json(RESPONSE);
    } catch (error) {
      console.log('Error método: logout');
      return res.status(400).json(error);
    }
  }
}
