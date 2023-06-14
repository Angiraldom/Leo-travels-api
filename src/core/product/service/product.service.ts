import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../schema/product.schema';
import { buildResponseSuccess } from 'src/shared/utils/utilities/Response.util';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<CreateProductDto>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    createProductDto['createdAt'] = new Date();
    const newProduct = new this.productModel(createProductDto);
    await newProduct.save();

    return buildResponseSuccess({
      data: newProduct,
    });
  }

  async findAll(projection?: unknown) {
    const products = await this.productModel.find({}, projection);

    return buildResponseSuccess({
      data: products,
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} product`;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const unSet = { $unset: {} };
    if (updateProductDto.isCourse) {
      unSet.$unset = { weight: 1 };
    } else {
      unSet.$unset = { modules: 1 };
    }

    const product = await this.productModel.updateOne(
      { _id: id },
      { $set: updateProductDto, ...unSet },
    );

    return buildResponseSuccess({
      data: product,
    });
  }
}
