import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ type: String })
  password: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({ type: String, unique: true })
  email: string;

  @Prop({ type: String })
  typeDocument: string;

  @Prop({ type: Number, unique: true })
  numberDocument: number;

  @Prop({ type: String })
  rol: string;

  @Prop({ type: String })
  municipalityDepartament: string;

  @Prop({ type: String })
  residenceAddress: string;

  @Prop({ type: Number })
  codePostal: number;

  @Prop({ type: Number })
  phone: number;

  @Prop({ type: Boolean })
  status: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
