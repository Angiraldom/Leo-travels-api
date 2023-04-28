import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

import { AddUserDto } from './add-user.dto';

export class UpdateUserDto extends PartialType(AddUserDto) {
  @IsNotEmpty({ message: 'You must provide a _id' })
  @IsString({ message: 'It must be of string type (_id).' })
  _id: string;
}
