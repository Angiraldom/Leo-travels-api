import { Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Classes } from './classes.schema';

export class Modules extends Document {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Array<Classes> })
  classes: Array<Classes>;
}
