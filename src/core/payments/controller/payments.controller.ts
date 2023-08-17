import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  UseFilters,
  UseGuards,
} from '@nestjs/common';

import { PaymentsService } from '../service/payments.service';
import { RedisService } from 'src/shared/service/redis.service';
import { IWompi } from '../interface/IResponseWompi.interface';
import { Public } from 'src/core/auth/decorators/public.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { HttpExceptionFilter } from 'src/http-exception/http-exception.filter';

@UseFilters(HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private redisService: RedisService,
  ) {}

  @Public()
  @Post('notification')
  @HttpCode(200)
  wompiNotification(@Body() data: IWompi) {
    return this.paymentsService.validateWompi(data);
  }

  @Get('getPayments')
  findAll() {
    return this.paymentsService.findAll();
  }

  @Post('saveProduct')
  saveProduct(@Body() body: { reference: string; product: {} }) {
    return this.redisService.saveData(body);
  }

  @Get('getProducts/:reference')
  getProducts(@Param('reference') reference: string) {
    return this.redisService.getData(reference);
  }

  @Patch('updateAllProducts')
  updateAllProducts(@Body() body: { reference: string; products: [] }) {
    return this.redisService.updateAllProducts(body.reference, body.products);
  }
}
