import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';
import { Course } from 'src/core/course/schema/course.schema';

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

  @Prop({ type: Number })
  numberDocument: number;

  @Prop({ type: String })
  role: string;

  @Prop({ type: String })
  municipalityDepartament: string;

  @Prop({ type: String })
  residenceAddress: string;

  @Prop({ type: Number })
  codePostal: number;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: Boolean, default: true })
  status: boolean;

  @Prop({ type: Array<Course> })
  courses: Course[];

  @Prop({ type: Date })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
