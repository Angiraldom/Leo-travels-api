import {
  Controller,
  Post,
  UseGuards,
  Request,
  UseFilters,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../service/auth.service';
import { HttpExceptionFilter } from 'src/http-exception/http-exception.filter';

@UseFilters(HttpExceptionFilter)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  login(@Request() req) {
    return this.authService.generateJWT(req.user);
  }

  @Post('refresh_token')
  refreshToken(@Body('refresh_token') refresh_token) {
    return this.authService.validateRefreshToken(refresh_token);
  }
}