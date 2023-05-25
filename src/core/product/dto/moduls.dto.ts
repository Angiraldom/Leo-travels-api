import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

import { VideosDto } from './videos.dto';

export class ModulesDto {
  @IsString({ message: 'It must be of string type (name).' })
  @IsNotEmpty({ message: 'You must provide a name' })
  name: string;

  @IsString({ message: 'It must be of string type (description).' })
  @IsNotEmpty({ message: 'You must provide a description' })
  description: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'You must provide a value in videos' })
  @ValidateNested({ each: true })
  @Type(() => VideosDto)
  videos: VideosDto[];
}
