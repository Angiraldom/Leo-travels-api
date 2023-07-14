import { BadRequestException, InternalServerErrorException, Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ConfigType } from '@nestjs/config';

import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../schema/product.schema';
import { buildResponseSuccess } from 'src/shared/utils/utilities/Response.util';

import configuration from '../../../config';
import { UploadImagesService } from 'src/shared/service/upload-images.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<CreateProductDto>,
    @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
    private uploadImagesService: UploadImagesService
  ) {}

  async create(createProductDto: CreateProductDto, files) {
    const entity = plainToInstance(CreateProductDto, createProductDto);
    const errors = await validate(entity);

    if (errors.length > 0) {
      throw new BadRequestException({
        customMessage: errors,
        tag: 'ErrorBadRequest',
      });
    }

    const images = await this.uploadImages(files);

    createProductDto['createdAt'] = new Date();
    createProductDto['imageProperties'] = images.map((result) => { 
      return {
        key: result.Key, 
        url: result.Location 
      }
    });
  
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

  async findOne(id: string) {
    const product = await this.productModel.findById(id);
    return buildResponseSuccess({
      data: product,
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto, files) {
    const entity = plainToInstance(UpdateProductDto, updateProductDto);
    const errors = await validate(entity);

    if (errors.length > 0) {
      throw new BadRequestException({
        customMessage: errors,
        tag: 'ErrorBadRequest',
      });
    }

    const images = await this.uploadImages(files);
    const newImages = images.map((result) => { 
      return {
        key: result.Key, 
        url: result.Location 
      }
    });
    updateProductDto['imageProperties'] = [
      ...updateProductDto['imageProperties'],
      ...newImages,
    ];

    await this.productModel.findByIdAndUpdate(id, { ...updateProductDto });

    return buildResponseSuccess({
      data: 'Actualizado correctamente.',
    });
  }

  async uploadImages(file) {
    try {
      const uploadPromises = file.map((file) => {
        const uploadParams = {
          Bucket: this.config.aws.name,
          Key: file.originalname,
          Body: file.buffer,
        };

        return this.uploadImagesService.upload(uploadParams).promise();
      });

      const results = await Promise.all(uploadPromises);

      return results;
    } catch (error) {
      throw new InternalServerErrorException({
        customMessage:
          'Ocurrio un problema al momento de cargar las imagenes, vuelve a intentarlo',
        tag: 'ErrorServerUploadImages',
      });
    }
  }
}
