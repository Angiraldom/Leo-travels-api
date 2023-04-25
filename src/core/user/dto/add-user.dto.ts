import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsIn,
  IsBoolean,
} from 'class-validator';
import { ROLES, TYPE_DOCUMENT } from '../constant/fieldsValidation.constant';

export class AddUserDto {
  @IsString({ message: 'It must be of string type (name).' })
  @IsNotEmpty({ message: 'You must provide a name' })
  name: string;

  @IsString({ message: 'It must be of string type (lastName).' })
  @IsNotEmpty({ message: 'You must provide a last name' })
  lastName: string;

  @IsString({ message: 'It must be of string type (password).' })
  @IsNotEmpty({ message: 'You must provide a password' })
  password: string;

  @IsString({ message: 'It must be of string type (email).' })
  @IsNotEmpty({ message: 'You must provide a email' })
  @IsEmail({}, { message: 'It must comply with the standards of an email.' })
  email: string;

  @IsString({ message: 'It must be of string type (typeDocument).' })
  @IsNotEmpty({ message: 'You must provide a type document (typeDocument).' })
  @IsIn(TYPE_DOCUMENT, {
    message:
      'The type of document is incorrect. Verify the information provided.',
  })
  typeDocument: string;

  @IsNumber({}, { message: 'It must be of numeric type (numberDocument).' })
  @IsNotEmpty({ message: 'You must provide a number document.' })
  numberDocument: number;

  @IsString({ message: 'It must be of string type (rol).' })
  @IsNotEmpty({ message: 'You must provide a rol.' })
  @IsIn(ROLES, {
    message: 'The rol is incorrect. Verify the information provided.',
  })
  rol: string;

  @IsString({ message: 'It must be of string type (municipalityDepartament).' })
  @IsNotEmpty({ message: 'You must provide a city.' })
  municipalityDepartament: string;

  @IsString({ message: 'It must be of string type (residenceAddress).' })
  @IsNotEmpty({ message: 'You must provide a address.' })
  residenceAddress: string;

  @IsNumber({}, { message: 'It must be of numeric type (codePostal).' })
  @IsNotEmpty({ message: 'You must provide a code postal.' })
  codePostal: number;

  @IsNumber({}, { message: 'It must be of numeric type (phone).' })
  @IsNotEmpty({ message: 'You must provide a phone.' })
  phone: number;

  @IsBoolean({ message: 'It must be of boolean type (status)' })
  @IsNotEmpty({ message: 'You must provide a status.' })
  status: boolean;
}
