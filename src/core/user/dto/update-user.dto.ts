import {
  IsBoolean,
  IsNumber,
  IsIn,
  IsString,
  IsEmail,
  IsOptional,
} from 'class-validator';

import { ROLES, TYPE_DOCUMENT } from '../constant/fieldsValidation.constant';
import { IdUserDto } from './id-user.dto';

export class UpdateUserDto extends IdUserDto {
  @IsString({ message: 'It must be of string type (name).' })
  @IsOptional()
  name: string;

  @IsString({ message: 'It must be of string type (lastName).' })
  @IsOptional()
  lastName: string;

  @IsString({ message: 'It must be of string type (password).' })
  @IsOptional()
  password: string;

  @IsString({ message: 'It must be of string type (email).' })
  @IsEmail({}, { message: 'It must comply with the standards of an email.' })
  @IsOptional()
  email: string;

  @IsString({ message: 'It must be of string type (typeDocument).' })
  @IsOptional()
  @IsIn(TYPE_DOCUMENT, {
    message:
      'The type of document is incorrect. Verify the information provided.',
  })
  typeDocument: string;

  @IsNumber({}, { message: 'It must be of numeric type (numberDocument).' })
  @IsOptional()
  numberDocument: number;

  @IsString({ message: 'It must be of string type (rol).' })
  @IsIn(ROLES, {
    message: 'The rol is incorrect. Verify the information provided.',
  })
  @IsOptional()
  rol: string;

  @IsString({ message: 'It must be of string type (municipalityDepartament).' })
  @IsOptional()
  municipalityDepartament: string;

  @IsString({ message: 'It must be of string type (residenceAddress).' })
  @IsOptional()
  residenceAddress: string;

  @IsNumber({}, { message: 'It must be of numeric type (codePostal).' })
  @IsOptional()
  codePostal: number;

  @IsNumber({}, { message: 'It must be of numeric type (phone).' })
  @IsOptional()
  phone: number;

  @IsBoolean({ message: 'It must be of boolean type (status)' })
  @IsOptional()
  status: boolean;
}
