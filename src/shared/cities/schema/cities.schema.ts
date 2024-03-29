import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class City extends Document {

    @Prop()
    id: string;

    @Prop()
    codigoDeapartamento: string;

    @Prop()
    nombreDepartamento: string;

    @Prop()
    codigoMunicipio: string;

    @Prop()
    nombreMunicipio: string;
    
    @Prop({ type: Object })
    shippingPrice: Object;
}

export const CitySchema = SchemaFactory.createForClass(City);