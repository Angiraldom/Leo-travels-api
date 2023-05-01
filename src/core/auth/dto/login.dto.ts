import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'The email must be a string.' })
  @IsEmail({}, { message: 'It must comply with the standard of an email.' })
  @IsNotEmpty({ message: 'You must provide a login.' })
  email: string;

  @IsString({ message: 'The password must be a string.' })
  @IsNotEmpty({ message: 'You must be provide a login.' })
  password: string;
}
