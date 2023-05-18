import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../schema/product.schema';
import { IRequestResponse } from 'src/shared/utils/interface/IRequestResponse.interface';
import { buildResponseFail, buildResponseSuccess } from 'src/shared/utils/utilities/Response.util';

@Injectable()
export class ProductService {

  constructor(@InjectModel(Product.name) private readonly productModel: Model<CreateProductDto>) {}

  async create(createProductDto: CreateProductDto) {
    let response: IRequestResponse;
    try {
      createProductDto['createdAt'] = new Date();
      const newProduct = new this.productModel(createProductDto);
      await newProduct.save();
      
      response = buildResponseSuccess({
        data: newProduct,
      });
    } catch (error) {
      response = buildResponseFail({
        msg: error.message,
        state: false,
      });
    }
    return response;
  }

  async findAll() {
    let response: IRequestResponse;
    try {
      const products = await this.productModel.find({}, { moduls: 0 });
      
      response = buildResponseSuccess({
        data: products,
      });
    } catch (error) {
      response = buildResponseFail({
        msg: error.message,
        state: false,
      });
    }
    return response;
  }

  findOne(id: string) {
    return `This action returns a #${id} product`;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    let response: IRequestResponse;
    try {
      const product = await this.productModel.findByIdAndUpdate(id, updateProductDto, {
        new: true,
      });
      
      response = buildResponseSuccess({
        data: product,
      });
    } catch (error) {
      response = buildResponseFail({
        msg: error.message,
        state: false,
      });
    }
    return response;
  }
}
