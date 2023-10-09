import { IProduct } from 'src/core/product/interface/IProduct.interface';
import { IEpayco } from './IResponseEpayco.interface';
import { IWompi } from './IResponseWompi.interface';

export const TYPE_CURRENCY: string[] = ['COP'];

export const COUNTRIES: string[] = ['CO'];

export const PREFIX: string[] = ['+57'];

type GATEWAY_TYPE = 'epayco' | 'wompy';

export interface ITransaction {
  gatewayData: IEpayco | IWompi;
  gateway: GATEWAY_TYPE;
  orden: number | string;
  reference: string;
  fecha: Date;
  total: number;
  products: IProduct[];
  shippingPrice?: number;
  user: {
    name: string;
    numberDocument: string;
    typeDocument: string;
    email: string;
    phone: string;
  };
  shippingAdress: {
    country: string;
    department: string;
    city: string;
    adress: string;
    adressEspecification: string;
  };
}
