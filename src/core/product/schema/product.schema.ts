import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { User } from 'src/core/user/schema/user.schema';
import { Modules } from './moduls.schema';

@Schema()
export class Product extends Document {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Number })
  price: number;

  @Prop({ type: Boolean, default: false })
  isCourse: boolean;

  @Prop({ type: Number })
  weight: number;

  @Prop({ type: Number })
  discount: number;

  // @Prop({ type: Array<string> })
  // tags: Array<string>;

  @Prop({ type: Array<Modules> })
  modules: Array<Modules>;

  @Prop({ type: Boolean, default: true })
  status: boolean;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  // @Prop({ type: User })
  // creator: User;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
