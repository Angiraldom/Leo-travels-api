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
      user: idUser
    };

    const newComment = new this.commentsModel(payload);
    await newComment.save();

    return buildResponseSuccess({
      data: newComment,
    });
  }

  async findOne(idClass: string) {
    const comments = await this.commentsModel.find({ idClass: idClass })
    .populate('user', 'name lastName');
    return buildResponseSuccess({
      data: comments,
    });
  }
}
