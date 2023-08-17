import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateCommentDto } from '../dto/create-comment.dto';
import { Comments } from '../schema/comment.schema';
import { buildResponseSuccess } from 'src/shared/utils/utilities/Response.util';
import { NotificationsService } from './notifications.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name)
    private readonly commentsModel: Model<Comments>,
    private notificationsService: NotificationsService,
  ) {}

  async create(createCommentDto: CreateCommentDto, idUser: string) {
    const payload = {
      ...createCommentDto,
      user: idUser,
    };

    const newComment = new this.commentsModel(payload);
    const comment = await newComment.save();

    await this.notificationsService.create({
      comment: comment._id,
      creator: idUser,
      userCreatorComment: idUser,
      seenBy: [idUser]
    });

    return buildResponseSuccess({
      data: newComment,
    });
  }

  async findOne(idClass: string) {
    const comments = await this.commentsModel
    .find()
      .find({ 'class._id': idClass }, { comment: 1, 'class.name': 1, 'class._id': 1 })
      .sort({ createdAt: -1 })
      .populate('user', 'name lastName')
      .populate({ path: 'answers.creator', select: 'name lastName', model: 'Users' })
      .exec();

    return buildResponseSuccess({
      data: comments,
    });
  }

  async removeComment(idComment: string) {
    const comments = await this.commentsModel.findByIdAndDelete(idComment);

    await this.notificationsService.removeNotificationsComments(idComment);

    return buildResponseSuccess({
      data: comments,
    });
  }

  async saveAnswer(idComment: string, answer: string, creator: string, userCreatorComment: string) {
    const body = {
      answer,
      createdAt: new Date(),
      creator,
      _id: new Date().getTime().toString()
    };

    const comment = await this.commentsModel.findByIdAndUpdate(idComment, {
      $push: {
        answers: body,
      },
    });

    await this.notificationsService.create({
      comment: idComment,
      creator,
      userCreatorComment,
      seenBy: [creator],
      answer: body._id,
      isAnswer: true
    });

    return buildResponseSuccess({
      data: comment,
    });
  }

  async removeAnswer(idComment: string, idAnswer: string) {
    const comment = await this.commentsModel.findById(idComment);
    
    const answersList: any = comment.answers.filter((item) => item._id !== idAnswer);
    comment.answers = answersList;
    comment.markModified('modules');
    await comment.save();

    await this.notificationsService.removeNotificationsAnswers(idAnswer);

    return buildResponseSuccess({
      data: 'Eliminado exitosamente',
    });
  }
}
