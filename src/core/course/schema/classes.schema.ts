import { Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class Classes extends Document {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  url: string;

  @Prop({ type: Boolean, default: false })
  completed: boolean;

  @Prop({ type: String })
  duration: string;
}
