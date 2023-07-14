import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ClassDto {
  @IsString({ message: 'It must be of string type (_id).' })
  @IsOptional()
  _id: string;

  @IsString({ message: 'It must be of string type (name).' })
  @IsNotEmpty({ message: 'You must provide a name' })
  name: string;

  @IsString({ message: 'It must be of url type (url).' })
  @IsOptional()
  url: string;

  @IsString({ message: 'It must be of string type (description).' })
  @IsOptional()
  description: string;

  @IsString({ message: 'It must be of string type (duration).' })
  @IsOptional()
  duration: string;
}

export class UpdateClassDto {
  @IsBoolean({ message: 'It must be of boolean type (completed).' })
  @IsNotEmpty({ message: 'You must provide a completed' })
  completed: boolean;
}
