import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigType } from '@nestjs/config';

import { CreateCourseDto } from '../dto/create-course.dto';
import { Product } from 'src/core/product/schema/product.schema';
import { UploadImagesService } from 'src/shared/service/upload-images.service';
import configuration from '../../../config';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { buildResponseSuccess } from 'src/shared/utils/utilities/Response.util';
import { ModulesDto } from '../dto/moduls.dto';
import { ClassDto } from '../dto/class.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
    @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
    private uploadImagesService: UploadImagesService,
  ) {}

  findAll() {
    return `This action returns all course`;
  }

  async create(createCourseDto: CreateCourseDto, file) {
    const entity = plainToInstance(CreateCourseDto, createCourseDto);
    const errors = await validate(entity);

    if (errors.length > 0) {
      throw new BadRequestException({
        customMessage: errors,
        tag: 'ErrorBadRequest',
      });
    }

    const urlImage = await this.uploadImage(file);

    createCourseDto['createdAt'] = new Date();
    createCourseDto['portada'] = urlImage;
    createCourseDto['isCourse'] = true;
    const newCourse = new this.productModel(createCourseDto);
    await newCourse.save();

    return buildResponseSuccess({
      data: newCourse,
    });
  }

  async createModule(id: string, data: ModulesDto) {
    data['_id'] = new Date().getTime().toString();
    await this.productModel.findByIdAndUpdate(id,
    {
      $push: {
        modules: data
      }
    });

    return buildResponseSuccess({
      data: data,
    });
  }

  async createClass(idCourse: string, idModule: string, data: ClassDto) {
    data['_id'] = new Date().getTime().toString();
    const course = await this.productModel.findById(idCourse);
    
    const module = course.modules.find((module) => module._id === idModule);
    module.classes.push(data);
    course.markModified('modules'); 
    course.markModified('classes'); 
    await course.save();
    return buildResponseSuccess({
      data: data,
    });
  }

  async update(id: string, updateCourseDto: CreateCourseDto) {
    await this.productModel.findByIdAndUpdate(id, updateCourseDto);
    return buildResponseSuccess({
      data: updateCourseDto,
    });
  }

  async updateModule(idCourse: string, idModule: string, data: ModulesDto) {
    const course = await this.productModel.findById(idCourse);
    
    course.modules= course.modules.map((module) => {
      if (module._id === idModule) {
        module = {...module, ...data}
      }
      return module;
    });
    course.markModified('modules'); 
    return buildResponseSuccess({
      data: 'Actualizado exitosamente',
    });
  }

  async updateClass(idCourse: string, idModule: string, idClass: string, data: ClassDto) {
    const course = await this.productModel.findById(idCourse);
    
    const module = course.modules.find((module) => module._id === idModule);
    module.classes = module.classes.map((item) => {
      if (item._id === idClass) {
        item = {...item, ...data}
      }
      return item;
    });
    course.markModified('modules'); 
    course.markModified('classes'); 
    return buildResponseSuccess({
      data: 'Actualizado exitosamente',
    });
  }

  async deleteModule(idCourse: string, idModule: string) {
    const course = await this.productModel.findById(idCourse);
    
    course.modules = course.modules.filter((module) => module._id !== idModule);
    course.markModified('modules'); 
    await course.save();
    return buildResponseSuccess({
      data: 'Eliminado exitosamente',
    });
  }

  async deleteClass(idCourse: string, idModule: string, idClass: string) {
    const course = await this.productModel.findById(idCourse);
    
    const module = course.modules.find((module) => module._id === idModule);
    module.classes = module.classes.filter((item) => item._id !== idClass);
    course.markModified('modules'); 
    course.markModified('classes'); 
    await course.save();
    return buildResponseSuccess({
      data: 'Eliminado exitosamente',
    });
  }

  async uploadImage(file) {
    try {
      const uploadParams = {
        Bucket: this.config.aws.name,
        Key: file.originalname,
        Body: file.buffer,
      };
      const result = await this.uploadImagesService
        .upload(uploadParams)
        .promise();

      return result.Location;
    } catch (error) {
      console.log(error);
      
      throw new InternalServerErrorException({
        customMessage:
          'Ocurrio un problema al momento de cargar las imagenes, vuelve a intentarlo',
        tag: 'ErrorServerUploadImages',
      });
    }
  }
}
