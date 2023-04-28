import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsObject, IsOptional, IsPositive, IsString, IsUrl, ValidateNested } from "class-validator";

import { COUNTRIES, PREFIX, TYPE_CURRENCY } from "../interface/IPayment.interface";
import { TYPE_DOCUMENT } from "src/core/user/constant/fieldsValidation.constant";

export class CreatePaymentDto {
    
    @IsNotEmpty({ message: 'You must provide a currency' })
    @IsIn(TYPE_CURRENCY, {
        message:
          'The type currency is incorrect. Verify the information provided.',
    })
    currency: string;

    @IsNumber({ allowNaN: false })
    @IsPositive({ message: 'It must be of number type (amountInCents).' })
    @IsNotEmpty({ message: 'You must provide a amountInCents' })
    amountInCents: number;

    @IsNumber({ allowNaN: false })
    @IsNotEmpty({ message: 'You must provide a reference' })
    reference: number;

    @IsString({ message: 'It must be of string type (amountInCents).' })
    @IsNotEmpty({ message: 'You must provide a publicKey' })
    publicKey: string;

    @IsUrl({}, { message: 'It must be of URL type (redirectUrl).' })
    @IsOptional()
    redirectUrl: string;

    @IsObject({ message: 'It must be of object type (customerData).' })
    @IsOptional()
    @ValidateNested()
    customerData: CustomerDataDto;

    @IsObject({ message: 'It must be of object shippingAddress (customerData).' })
    @IsOptional()
    @ValidateNested()
    shippingAddress: ShippingAddressDto;
}

class CustomerDataDto {
    
    @IsString({ message: 'It must be of string type (email).' })
    @IsEmail({}, { message: 'It must comply with the standards of an email.' })
    email: string;

    @IsString({ message: 'It must be of string type (fullName).' })
    fullName: string;

    @IsString({ message: 'It must be of string type (phoneNumber).' })
    phoneNumber: string;

    @IsIn(PREFIX, {
        message:
          'The type prefix is incorrect. Verify the information provided.',
    })
    phoneNumberPrefix: string;

    @IsString({ message: 'It must be of string type (legalId).' })
    legalId: string;

    @IsIn(TYPE_DOCUMENT, {
        message:
          'The type of legalIdType is incorrect. Verify the information provided.',
    })
    legalIdType: string;
}

class ShippingAddressDto {

    @IsString({ message: 'It must be of string type (addressLine1).' })
    addressLine1: string;

    @IsString({ message: 'It must be of string type (city).' })
    city: string;

    @IsString({ message: 'It must be of string type (phoneNumber).' })
    phoneNumber: string;

    @IsString({ message: 'It must be of string type (region).' })
    region: string;

    @IsIn(COUNTRIES, {
        message:
          'The type of country is incorrect. Verify the information provided.',
    })
    country: string;
}
    
