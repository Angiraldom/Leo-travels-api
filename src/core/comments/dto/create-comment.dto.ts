import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ClassDto } from 'src/core/course/dto/class.dto';

export class CreateCommentDto {
  @IsString({ message: 'It must be of string type (comment).' })
  @IsNotEmpty({ message: 'You must provide a comment' })
  comment: string;

  @IsString({ message: 'It must be of string type (idModule).' })
  @IsNotEmpty({ message: 'You must provide a idModule' })
  idModule: string;

  @IsString({ message: 'It must be of string type (idCourse).' })
  @IsNotEmpty({ message: 'You must provide a idCourse' })
  idCourse: string;

  @ValidateNested()
  @Type(() => ClassDto)
  class: string;
}
