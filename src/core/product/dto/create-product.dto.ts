import { Type } from "class-transformer";
import { ArrayMinSize, ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateIf, ValidateNested } from "class-validator";

import { ModulsDto } from "./moduls.dto";

export class CreateProductDto {
    
  @IsString({ message: 'It must be of string type (name).' })
  @IsNotEmpty({ message: 'You must provide a name' })
  name: string;

  @IsString({ message: 'It must be of string type (description).' })
  @IsNotEmpty({ message: 'You must provide a description' })
  description: string;

  @IsNumber({ allowNaN: false }, { message: 'It must be of number type (price).' })
  @IsPositive({ message: 'You must provide a positive number price' })
  @IsNotEmpty({ message: 'You must provide a price' })
  price: number;

  @IsBoolean({ message: 'It must be of boolean type (isCourse).' })
  @IsNotEmpty({ message: 'You must provide a isCourse' })
  isCourse: boolean;

  @IsNumber({ allowNaN: false }, { message: 'It must be of number type (weight).' })
  @IsPositive({ message: 'You must provide a positive number weight' })
  @IsOptional()
  weight: number;

  @IsNumber({ allowNaN: false }, { message: 'It must be of number type (discount).' })
  @IsPositive({ message: 'You must provide a positive number discount' })
  @IsOptional()
  discount: number;

  @IsArray({ message: 'It must be of array type (tags).' })
  @ArrayMinSize(1, { message: 'You must provide a value in tags' })
  tags: string[];

  @IsBoolean({ message: 'It must be of boolean type (status).' })
  @IsNotEmpty({ message: 'You must provide a status' })
  @IsOptional()
  status: boolean;

  @ValidateIf((body) => body.isCourse)
  @IsArray()
  @ArrayNotEmpty({ message: 'videos must be an array' })
  @ValidateNested({ each: true })
  @Type(() => ModulsDto)
  moduls: ModulsDto[];

//   @IsObject({ message: 'You must provide a valid creator' })
//   @IsNotEmptyObject({nullable: false}, { message: 'You must provide a valid creator' })
//   @IsNotEmpty({ message: 'You must provide a creator' })
//   @ValidateNested()
//   @Type(() => AddUserDto)
//   creator: AddUserDto;
}
