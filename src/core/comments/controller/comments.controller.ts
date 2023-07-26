import { Controller, Get, Post, Body, Param, UseGuards, UseFilters, Request, Delete } from '@nestjs/common';

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
}
