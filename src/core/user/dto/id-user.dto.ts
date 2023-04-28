import { IsNotEmpty, IsString } from 'class-validator';

export class IdUserDto {
  @IsNotEmpty({ message: 'You must provide a _id' })
  @IsString({ message: 'It must be of string type (_id).' })
  _id: string;
}
