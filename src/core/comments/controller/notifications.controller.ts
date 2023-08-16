import {
  Controller,
  UseGuards,
  UseFilters,
  Request,
  Get,
  Query,
} from '@nestjs/common';

import { HttpExceptionFilter } from 'src/http-exception/http-exception.filter';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { NotificationsService } from '../service/notifications.service';
import { IPayloadToken } from 'src/core/auth/interface/IPayloadToken.interface';

@UseFilters(HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  getNotifications(
    @Query("limit") limit: number,
    @Query("offset") offset: number,
    @Request() req: { user: IPayloadToken }) {
    if (req.user.role === 'Admin') {
      return this.notificationsService.notificationsAdmin(req.user.sub, limit, offset);
    }
    return this.notificationsService.notificationsUser(req.user.sub, limit, offset);
  }

  @Get('update')
  seenNotifications(@Request() req: { user: IPayloadToken }) {
    if (req.user.role === 'Admin') {
      return this.notificationsService.seenNotificationsAdmin(req.user.sub);
    }
    return this.notificationsService.seenNotificationsUser(req.user.sub);
  }
}
