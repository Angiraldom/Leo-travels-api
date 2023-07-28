import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
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
  @Min(0, { message: 'You must provide a positive number price' })
  @IsNotEmpty({ message: 'You must provide a price' })
  price: number;

  @IsNumber(
    { allowNaN: false },
    { message: 'It must be of number type (taxes).' },
  )
  @Min(0, { message: 'You must provide a positive number taxes' })
  @IsNotEmpty({ message: 'You must provide a taxes' })
  taxes: number;

  @IsNumber(
    { allowNaN: false },
    { message: 'It must be of number type (priceWithoutTaxes).' },
  )
  @Min(0, { message: 'You must provide a positive number priceWithoutTaxes' })
  @IsNotEmpty({ message: 'You must provide a priceWithoutTaxes' })
  priceWithoutTaxes: number;


  @IsNumber(
    { allowNaN: false },
    { message: 'It must be of number type (discount).' },
  )
  @Min(0, { message: 'You must provide a positive number discount' })
  @IsOptional()
  discount: number;

  // @IsArray({ message: 'It must be of array type (tags).' })
  // @ArrayMinSize(1, { message: 'You must provide a value in tags' })
  // tags: string[];

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
