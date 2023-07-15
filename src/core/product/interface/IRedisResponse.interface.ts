import { IProduct } from "./IProduct.interface";

export interface IRedisResponse{
    reference: string;
    products: IProduct[]
}