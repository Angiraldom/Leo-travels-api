import { Module } from '@nestjs/common';
import { CommentsController } from './controller/comments.controller';
import { CommentsService } from './service/comments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema, Comments } from './schema/comment.schema';
import { NotificationSchema, Notification } from './schema/notification.schema';
import { NotificationsService } from './service/notifications.service';
import { NotificationsController } from './controller/notifications.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comments.name, schema: CommentSchema },
      { name: Notification.name, schema: NotificationSchema }
    ]),
  ],
  controllers: [CommentsController, NotificationsController],
  providers: [CommentsService, NotificationsService],
})
export class CommentsModule {}
