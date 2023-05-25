import { Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { Videos } from './videos.schema';

export class Modules extends Document {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Array<Videos> })
  videos: Array<Videos>;
}
