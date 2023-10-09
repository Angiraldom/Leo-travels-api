import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IProduct } from 'src/core/product/interface/IProduct.interface';
import { Data, Signature } from './wompi.schema';
import { IEpayco } from '../interface/IResponseEpayco.interface';
import { IWompi } from '../interface/IResponseWompi.interface';

@Schema()
export class Payment extends Document {
  @Prop({ type: Object, required: true })
  gatewayData: IEpayco | IWompi;

  @Prop({ required: true })
  gateway: string;

  @Prop({ type: String, required: true })
  orden: string;

  @Prop({ required: true })
  reference: string;

  @Prop({ required: true, type: Date })
  fecha: Date;

  @Prop({ required: true })
  total: number;

  @Prop({ type: [Object], required: true })
  products: IProduct[];

  @Prop({ type: Number })
  shippingPrice: number;

  @Prop({ type: Object, required: true })
  user: {
    name: string;
    numberDocument: string;
    typeDocument: string;
    email: string;
    phone: string;
  };

  @Prop({ type: Object })
  shippingAdress: {
    country: string;
    department: string;
    city: string;
    adress: string;
    adressEspecification: string;
  };
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
