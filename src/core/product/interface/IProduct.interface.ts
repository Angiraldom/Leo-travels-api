export interface IProduct {
    id?: number;
    _id?: string;
    title?: string;
    price?: number;
    description?: string;
    images?: any[];
    creationAt?: Date | string;
    updatedAt?: Date | string;
    category?: any[];
    amount?: number;
    modules?: any[];
    discount?: number;
    discountDescription?: string;
}