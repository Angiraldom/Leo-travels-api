import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { IProduct } from "src/core/product/interface/IProduct.interface";
import { Product } from "src/core/product/schema/product.schema";

export class DiscountCoupon extends Document {
  @Prop({ type: String })
  coupon: string;

  @Prop({ type: String })
  descriptionName: string;

  @Prop({ type: Number })
  discount: number;

  @Prop({ type: [Product] })
  products: Types.Array<Record<string, IProduct>>;

  @Prop({ type: Date })
  startDate: Date;

  @Prop({ type: Date })
  endDate: Date;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const DiscountCouponSchema = SchemaFactory.createForClass(DiscountCoupon);
