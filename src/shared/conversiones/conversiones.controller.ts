import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ConversionesService } from '../service/conversiones-api.service';
import { ITypeEvents } from '../utils/interface/ITypeEvents.interface';

@Controller('conversiones')
export class ConversionesController {
  constructor(private readonly conversionesService: ConversionesService) {}

  @Post('standard')
  conversiones(@Req() request: Request, @Body() data: { eventName: ITypeEvents }) {
    this.conversionesService.sendStandardEvent(request, data.eventName);
  }

  @Post('purchase')
  conversionesPurchase(@Req() request: Request, @Body() data: { value: number }) {
    this.conversionesService.purchaseEvent(request, data.value);
  }
}
