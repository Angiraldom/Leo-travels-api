export interface IEpayco {
    x_cust_id_cliente: number;
    x_ref_payco: number;
    x_id_factura: string;
    x_id_invoice: string;
    x_description: string;
    x_amount: number;
    x_amount_country: number;
    x_amount_ok: number;
    x_tax: number;
    x_amount_base: number;
    x_currency_code: string;
    x_bank_name: string;
    x_cardnumber: string;
    x_quotas: number;
    x_respuesta: string;
    x_response: string;
    x_approval_code: string;
    x_transaction_id: string;
    x_fecha_transaccion: string;
    x_transaction_date: string;
    x_cod_respuesta: number;
    x_cod_response: number;
    x_response_reason_text: string;
    x_errorcode: string;
    x_cod_transaction_state: number;
    x_transaction_state: string;
    x_franchise: string;
    x_business: null | string;
    x_customer_doctype: string;
    x_customer_document: string;
    x_customer_name: string;
    x_customer_lastname: string;
    x_customer_email: string;
    x_customer_phone: string;
    x_customer_movil: string;
    x_customer_ind_pais: string;
    x_customer_country: string;
    x_customer_city: string;
    x_customer_address: string;
    x_customer_ip: string;
    x_test_request: boolean;
    x_extra1: string; // -> Datos del usuario.
    x_extra2: string; // -> Datos de entrega.
    x_extra3: null;
    x_extra4: null;
    x_extra5: null;
    x_extra6: null;
    x_extra7: null;
    x_extra8: null;
    x_extra9: null;
    x_extra10: null;
    x_tax_ico: number;
    x_payment_date: null | string;
    x_signature: string;
    x_transaction_cycle: null | string;
    is_processable: boolean;
}
