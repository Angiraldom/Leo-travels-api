import { Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class Videos extends Document {
  @Prop({ type: String })
  name: string;

  @Prop({ type: URL })
  url: string;
}
