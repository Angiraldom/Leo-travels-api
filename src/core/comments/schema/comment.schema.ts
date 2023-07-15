import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/core/user/schema/user.schema';

@Schema()
export class Comment extends Document {
  @Prop({ type: String })
  idClass: string;

  @Prop({ type: Types.ObjectId, ref: 'Users' })
  user: User | Types.ObjectId;

  @Prop({ type: String })
  comment: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
