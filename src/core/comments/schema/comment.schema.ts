import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Classes } from 'src/core/course/schema/classes.schema';
import { User } from 'src/core/user/schema/user.schema';

@Schema()
export class Comments extends Document {
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
    creator: { type: Types.ObjectId, ref: 'Users' },
    createdAt: Date,
    _id: String,
  }];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comments);
