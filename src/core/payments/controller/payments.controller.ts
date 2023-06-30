import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, HttpCode } from '@nestjs/common';

import { PaymentsService } from '../service/payments.service';
import { RedisService } from 'src/shared/service/redis.service';
import { IWompi } from '../interface/IResponseWompi.interface';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private redisService: RedisService) {}

  @Post('notification')
  @HttpCode(200)
  wompiNotification(@Body() data: IWompi) {
   return this.paymentsService.validateWompi(data);
  }

  @Get('getPayments')
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Post('saveProduct')
  saveProduct(@Body() body: {reference: string; product: {}}) {
    return this.redisService.saveData(body);
  }

  @Get('getProducts/:reference')
  getProducts(@Param('reference') reference: string) {
    return this.redisService.getData(reference);
  }

  @Patch('updateAllProducts')
  updateAllProducts(@Body() body: {reference: string; products: []}) {
    return this.redisService.updateAllProducts(body.reference, body.products);
  }
}

