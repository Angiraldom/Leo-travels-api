import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Prefix extends Document {
    @Prop()
    country: string;

    @Prop()
    prefix: string;
}

export const PrefixSchema = SchemaFactory.createForClass(Prefix);
