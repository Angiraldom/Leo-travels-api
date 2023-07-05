import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from 'mongoose';
import { IProduct } from "src/core/product/interface/IProduct.interface";
import { Data, Signature } from "./wompi.schema";

@Schema()
export class Payment extends Document {
    @Prop()
    data?: Data;
    @Prop()
    event?: string;
    @Prop()
    sent_at?: Date;
    @Prop()
    signature?: Signature;
    @Prop()
    timestamp?: number;
    @Prop()
    environment?: string;
    @Prop()
    products: IProduct[]
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
