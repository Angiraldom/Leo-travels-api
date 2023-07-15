import { IProduct } from "src/core/product/interface/IProduct.interface";

export interface IWompi {
    data?: Data;
    event?: string;
    sent_at?: Date;
    signature?: Signature;
    timestamp?: number;
    environment?: string;
    products: IProduct[]
  }
  
  export interface Data {
    transaction?: Transaction;
  }
  
  export interface Transaction {
    id?: string;
    status?: string;
    currency?: string;
    reference?: string;
    created_at?: Date;
    billing_data?: BillingData;
    finalized_at?: Date;
    redirect_url?: string;
    customer_data?: CustomerData;
    customer_email?: string;
    payment_method?: PaymentMethod;
    status_message?: null;
    amount_in_cents?: number;
    payment_link_id?: null;
    shipping_address?: ShippingAddress;
    payment_source_id?: null;
    payment_method_type?: string;
  }
  
  export interface BillingData {
    legal_id?: string;
    legal_id_type?: string;
  }
  
  export interface CustomerData {
    legal_id?: string;
    full_name?: string;
    phone_number?: string;
    legal_id_type?: string;
  }
  
  export interface PaymentMethod {
    type?: string;
    extra?: Extra;
    token?: string;
    installments?: number;
  }
  
  export interface Extra {
    bin?: string;
    name?: string;
    brand?: string;
    exp_year?: string;
    exp_month?: string;
    last_four?: string;
    card_holder?: string;
    is_three_ds?: boolean;
    external_identifier?: string;
    processor_response_code?: string;
  }
  
  export interface ShippingAddress {
    city?: string;
    region?: string;
    country?: string;
    phone_number?: string;
    address_line_1?: string;
    address_line_2?: string;
  }
  
  export interface Signature {
    checksum?: string;
    properties?: string[];
  }