import { Module } from '@nestjs/common';
import { CommentsController } from './controller/comments.controller';
import { CommentsService } from './service/comments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema, Comment } from './schema/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema }
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
