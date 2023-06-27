import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateCourseDto {
  @IsString({ message: 'It must be of string type (name).' })
  @IsNotEmpty({ message: 'You must provide a name' })
  name: string;

  @IsString({ message: 'It must be of string type (description).' })
  @IsNotEmpty({ message: 'You must provide a description' })
  description: string;

  @IsNumber(
    { allowNaN: false },
    { message: 'It must be of number type (price).' },
  )
  @IsNotEmpty({ message: 'You must provide a price' })
  price: number;

  @IsNumber(
    { allowNaN: false },
    { message: 'It must be of number type (discount).' },
  )
  @Min(0, { message: 'You must provide a positive number discount' })
  @IsOptional()
  discount: number;

  @IsBoolean({ message: 'It must be of boolean type (status).' })
  @IsNotEmpty({ message: 'You must provide a status' })
  @IsOptional()
  status: boolean;

  //   @IsObject({ message: 'You must provide a valid creator' })
  //   @IsNotEmptyObject({nullable: false}, { message: 'You must provide a valid creator' })
  //   @IsNotEmpty({ message: 'You must provide a creator' })
  //   @ValidateNested()
  //   @Type(() => AddUserDto)
  //   creator: AddUserDto;
}
