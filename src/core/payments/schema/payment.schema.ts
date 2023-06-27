import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from 'mongoose';

import { ShippingAddress } from "./ShippingAddress.schema";
import { CustomerData } from "./customerData.schema";

@Schema()
export class Payment extends Document {

    @Prop()
    currency: string;

    @Prop()
    amountInCents: number;

    @Prop()
    reference: number;

    @Prop()
    redirectUrl: string;
    
    @Prop()
    customerData: CustomerData;

    @Prop()
    shippingAddress: ShippingAddress;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
