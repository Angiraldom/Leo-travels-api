import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreatePaymentDto } from '../dto/create-payment.dto';
import { IRequestResponse } from 'src/shared/utils/interface/IRequestResponse.interface';
import { buildResponseCreate, buildResponseFail, buildResponseSuccess } from 'src/shared/utils/utilities';
import { Payment } from '../schema/payment.schema';

@Injectable()
export class PaymentsService {
  constructor(@InjectModel(Payment.name) private readonly invoiceModel: Model<Payment>) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<IRequestResponse> {
    let response: IRequestResponse;
    try {
    
      const NEW_INVOICE = new this.invoiceModel(createPaymentDto);
      await NEW_INVOICE.save();

      response = buildResponseCreate({ data: true });
    } catch (error) {
      response = buildResponseFail({
        msg: error.message,
        state: false,
      });
    }
    return response;
  }

  async findAll(): Promise<IRequestResponse> {
    let response: IRequestResponse;
    try {
      const ALL_INVOICES = await this.invoiceModel
        .find({});
        
      response = buildResponseSuccess({
        data: ALL_INVOICES,
      });
    } catch (error) {
      response = buildResponseFail({
        msg: error.message,
        state: false,
      });
    }
    return response;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

}
