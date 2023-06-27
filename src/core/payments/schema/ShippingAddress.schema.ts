import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ShippingAddress extends Document {

    @Prop()
    addressLine1: string;

    @Prop()
    city: string;

    @Prop()
    phoneNumber: string;

    @Prop()
    region: string;

    @Prop()
    country: string;
}