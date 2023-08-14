import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateCommentDto } from '../dto/create-comment.dto';
import { Comment } from '../schema/comment.schema';
import { buildResponseSuccess } from 'src/shared/utils/utilities/Response.util';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentsModel: Model<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto, idUser: Types.ObjectId) {
    const payload = {
      ...createCommentDto,
      user: idUser,
    };

    const newComment = new this.commentsModel(payload);
    await newComment.save();

    return buildResponseSuccess({
      data: newComment,
    });
  }

  async findOne(idClass: string) {
    const comments = await this.commentsModel
      .find({ 'class._id': idClass })
      .sort({ createdAt: -1 })
      .populate('user', 'name lastName')
      .populate({ path: 'answers.user', select: 'name lastName', model: 'Users' })
      .exec();
    
    return buildResponseSuccess({
      data: comments,
    });
  }

  async findAll(limit: number, offset: number) {
    const comments = await this.commentsModel
      .find()
      .skip(limit * offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('user', 'name lastName');
    
    return buildResponseSuccess({
      data: comments,
    });
  }

  async removeComment(idComment: string) {
    const comments = await this.commentsModel.findByIdAndDelete(idComment);
    return buildResponseSuccess({
      data: comments,
    });
  }

  async saveAnswer(idComment: string, answer: string, idUser: Types.ObjectId) {
    const body = {
      answer,
      createdAt: new Date(),
      user: idUser,
      seenBy: []
    };

    const comment = await this.commentsModel.findByIdAndUpdate(idComment, {
      $push: {
        answers: body,
      },
    });
    return buildResponseSuccess({
      data: comment,
    });
  }
}
