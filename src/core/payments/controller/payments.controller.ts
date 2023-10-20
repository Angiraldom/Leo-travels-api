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
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { PaymentsService } from '../service/payments.service';
import { RedisService } from 'src/shared/service/redis.service';
import { IWompi } from '../interface/IResponseWompi.interface';
import { Public } from 'src/core/auth/decorators/public.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { HttpExceptionFilter } from 'src/http-exception/http-exception.filter';
import { IEpayco } from '../interface/IResponseEpayco.interface';

// @UseFilters(HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private redisService: RedisService,
  ) {}

  @Public()
  @Post('notification-epayco')
  @HttpCode(200)
  async wompiNotificationEpaycoGet(@Query() data: IEpayco) {
    if (data.x_respuesta !== 'Aceptada') {
      return 'El estado de la transacción no es aprobado';
    }
    await this.paymentsService.createObjectEpayco(data);
    return 'Compra realizada con exito.';
  }

  @Public()
  @Post('notification')
  @HttpCode(200)
  async wompiNotification(@Body() data: IWompi, @Res() response: Response) {
    if (data.data.transaction.status !== 'APPROVED') {
      return response.status(HttpStatus.OK).send('El estado de la transacción no es aprobado');
    }
    await this.paymentsService.createObjectWompi(data);
    return response.status(HttpStatus.OK).send('Compra realizada con exito.');
  }

  @Get('getPayments')
  findAll() {
    return this.paymentsService.findAll();
  }

  @Public()
  @Post('saveProduct')
  saveProduct(@Body() body: { reference: string; product: {} }) {
    return this.redisService.saveData(body);
  }

  @Public()
  @Get('getProducts/:reference')
  getProducts(@Param('reference') reference: string) {
    return this.redisService.getData(reference);
  }

  @Public()
  @Patch('updateAllProducts')
  updateAllProducts(
    @Body() body: { reference: string; products: []; shippingPrice: number },
  ) {
    return this.redisService.updateAllProducts(
      body.reference,
      body.products,
      body.shippingPrice,
    );
  }

  @Public()
  @Get('wompiTransactions')
  wompiTransactions() {
    return this.paymentsService.validateTransactionsWompi();
  }
}
