import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class CustomerData extends Document {
    
    @Prop()
    email: string;

    @Prop()
    fullName: string;

    @Prop()
    phoneNumber: string;

    @Prop()
    phoneNumberPrefix: string;

    @Prop()
    legalId: string;

    @Prop()
    legalIdType: string;
}