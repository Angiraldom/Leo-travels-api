import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ClassDto } from './class.dto';

export class ModulesDto {
  @IsString({ message: 'It must be of string type (_id).' })
  @IsOptional()
  _id: string;

  @IsString({ message: 'It must be of string type (name).' })
  @IsNotEmpty({ message: 'You must provide a name' })
  name: string;

  @IsString({ message: 'It must be of string type (description).' })
  @IsOptional()
  description: string;

  @IsOptional()
  @Type(() => ClassDto)
  classes: ClassDto[];
}
