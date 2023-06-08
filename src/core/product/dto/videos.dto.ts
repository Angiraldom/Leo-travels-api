import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class VideosDto {
  @IsString({ message: 'It must be of string type (name).' })
  @IsNotEmpty({ message: 'You must provide a name' })
  name: string;

  @IsUrl({}, { message: 'It must be of url type (url).' })
  @IsNotEmpty({ message: 'You must provide a url' })
  url: string;
}