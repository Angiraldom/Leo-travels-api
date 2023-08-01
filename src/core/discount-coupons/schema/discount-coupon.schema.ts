import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { Product } from "src/core/product/schema/product.schema";

@Schema()
export class DiscountCoupon extends Document {
  @Prop({ type: String })
  coupon: string;

  @Prop({ type: String })
  descriptionName: string;

  @Prop({ type: Number })
  discount: number;

  @Prop({ type: [{type: Types.ObjectId, ref: Product.name }]})
  products: Types.Array<Product>;

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
