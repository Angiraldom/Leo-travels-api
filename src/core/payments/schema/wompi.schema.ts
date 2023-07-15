
import { Document } from "mongoose";

export class Data extends Document {
  transaction?: Transaction;
}

export class Transaction extends Document {
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

export class BillingData extends Document {
  legal_id?: string;
  legal_id_type?: string;
}

export class CustomerData extends Document {
  legal_id?: string;
  full_name?: string;
  phone_number?: string;
  legal_id_type?: string;
}

export class PaymentMethod extends Document {
  type?: string;
  extra?: Extra;
  token?: string;
  installments?: number;
}

export class Extra extends Document {
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

export class ShippingAddress extends Document {
  city?: string;
  region?: string;
  country?: string;
  phone_number?: string;
  address_line_1?: string;
  address_line_2?: string;
}

export class Signature extends Document {
  checksum?: string;
  properties?: string[];
}