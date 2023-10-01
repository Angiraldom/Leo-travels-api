import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

@Schema()
export class PotentialCustomer extends Document {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  email: string;

  @Prop()
  autoriza: boolean;

  @Prop({ type: Date, default: Date.now() })
  createdAt: Date;
}

export const PotentialCustomerSchema =
  SchemaFactory.createForClass(PotentialCustomer);
