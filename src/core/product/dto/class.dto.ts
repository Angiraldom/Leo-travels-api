import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ClassDto {
  @IsString({ message: 'It must be of string type (_id).' })
  @IsOptional()
  _id: string;

  @IsString({ message: 'It must be of string type (name).' })
  @IsNotEmpty({ message: 'You must provide a name' })
  name: string;

  @IsString({ message: 'It must be of url type (url).' })
  @IsNotEmpty({ message: 'You must provide a url' })
  url: string;

  @IsString({ message: 'It must be of string type (description).' })
  @IsNotEmpty({ message: 'You must provide a description' })
  description: string;
}
