import { Type } from 'class-transformer';
import {
    IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateProductDto } from 'src/core/product/dto/create-product.dto';

export class CreateDiscountCouponDto {
  @IsString({ message: 'It must be of string type (coupon).' })
  @IsNotEmpty({ message: 'You must provide a coupon' })
  coupon: string;

  @IsString({ message: 'It must be of string type (descriptionName).' })
  @IsNotEmpty({ message: 'You must provide a descriptionName' })
  descriptionName: string;

  @IsNumber(
    { allowNaN: false },
    { message: 'It must be of number type (price).' },
  )
  @Min(0, { message: 'You must provide a positive number discount' })
  @IsNotEmpty({ message: 'You must provide a discount' })
  discount: number;

  @IsDate({ message: 'It must be of Date type (startDate).' })
  @IsNotEmpty({ message: 'You must provide a startDate' })
  startDate: Date;

  @IsDate({ message: 'It must be of Date type (endDate).' })
  @IsNotEmpty({ message: 'You must provide a endDate' })
  endDate: Date;

  @ValidateNested({message: 'It must be of array type (products).'})
  @Type(() => CreateProductDto)
  products: CreateProductDto[];
}
