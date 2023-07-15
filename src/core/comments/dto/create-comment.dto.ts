import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: 'It must be of string type (comment).' })
  @IsNotEmpty({ message: 'You must provide a comment' })
  comment: string;

  @IsString({ message: 'It must be of string type (idClass).' })
  @IsNotEmpty({ message: 'You must provide a idClass' })
  idClass: string;
}
