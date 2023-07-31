import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

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

  @IsDateString({}, { message: 'It must be of Date type (startDate).' })
  @IsNotEmpty({ message: 'You must provide a startDate' })
  startDate: Date;

  @IsDateString({strict: false}, { message: 'It must be of Date type (endDate).' })
  @IsNotEmpty({ message: 'You must provide a endDate' })
  endDate: Date;

  @IsArray({ message: 'It must be of array IDs products type (products).' })
  @IsNotEmpty()
  products: string[];
}
