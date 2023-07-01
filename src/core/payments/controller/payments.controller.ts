import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';

import { PaymentsService } from '../service/payments.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { RedisService } from 'src/shared/service/redis.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private redisService: RedisService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Post('notification')
  wompiNotification(@Body() data: any) {
    console.log(data);
    return new HttpException({}, HttpStatus.OK);
  }

  @Get()
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

