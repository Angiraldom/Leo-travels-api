import { Module } from '@nestjs/common';
import { ProductService } from './service/product.service';
import { ProductController } from './controller/product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/product.schema';
import { SharedModule } from 'src/shared/shared.module';
import { CourseService } from './service/course.service';
import { CourseController } from './controller/course.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    SharedModule,
  ],
  controllers: [ProductController, CourseController],
  providers: [ProductService, CourseService],
  exports: [ProductService]
})
export class ProductModule {}
