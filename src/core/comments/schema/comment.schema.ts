import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Classes } from 'src/core/course/schema/classes.schema';
import { User } from 'src/core/user/schema/user.schema';

@Schema()
export class Comment extends Document {
  @Prop({ type: Classes })
  class: Classes;

  @Prop({ type: String })
  idModule: string;

  @Prop({ type: String })
  idCourse: string;

  @Prop({ type: Types.ObjectId, ref: 'Users' })
  user: User | Types.ObjectId;

  @Prop({ type: String })
  comment: string;

  @Prop()
  answers: [{
    answer: String,
    user: { type: Types.ObjectId, ref: 'Users' },
    createdAt: Date,
    seenBy: Types.Array<User>,
  }];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Users' }] })
  seenBy: Types.Array<User>;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
