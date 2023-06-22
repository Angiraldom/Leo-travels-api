import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ModulesDto } from '../dto/moduls.dto';

@Schema()
export class Course extends Document {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Number })
  price: number;

  @Prop({ type: Number })
  discount: number;

  @Prop({ type: String })
  portada: string;

  @Prop({ type: Array<ModulesDto> })
  modules: Array<ModulesDto>;

  @Prop({ type: Boolean, default: true })
  status: boolean;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  // @Prop({ type: User })
  // creator: User;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
