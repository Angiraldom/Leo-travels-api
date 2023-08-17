import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/core/user/schema/user.schema';
import { Comments } from './comment.schema';

@Schema()
export class Notification extends Document {
  @Prop({ type: Types.ObjectId, ref: Comments.name, required: true })
  comment: Comments | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  creator: User | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  userCreatorComment: User | Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Users' }], default: [] })
  seenBy: Types.Array<User>;

  // Nos dice si la notificacion viene de un comentario o de una respuesta a un comentario.
  @Prop({ type: Boolean, default: false })
  isAnswer: boolean;

  @Prop({ type: String})
  answer: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
