import { Controller, Get, Post, Body, Param, UseGuards, UseFilters, Request, Delete, Query } from '@nestjs/common';

import { CreateCommentDto } from '../dto/create-comment.dto';
import { CommentsService } from '../service/comments.service';
import { HttpExceptionFilter } from 'src/http-exception/http-exception.filter';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';

@UseFilters(HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    return this.commentsService.create(createCommentDto, req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Delete(':id')
  removeComment(@Param('id') id: string) {
    return this.commentsService.removeComment(id);
  }

  @Delete('deleteAnswer/:idComment/:idAnswer')
  removeAnswer(@Param('idComment') idComment: string, @Param('idAnswer') idAnswer: string) {
    return this.commentsService.removeAnswer(idComment, idAnswer);
  }

  @Post('saveAnswer/:idComment')
  saveAnswer(@Param('idComment') id: string, @Body() body: { answer: string; idCreatorComment: string }, @Request() req) {
    return this.commentsService.saveAnswer(id, body.answer, req.user.sub, body.idCreatorComment);
  }
}
