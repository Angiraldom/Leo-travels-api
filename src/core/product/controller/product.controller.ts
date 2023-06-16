import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UploadedFiles,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductService } from '../service/product.service';
import { HttpExceptionFilter } from 'src/http-exception/http-exception.filter';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';

@UseFilters(HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  create(@UploadedFiles() file, @Body() data) {
    return this.productService.create(JSON.parse(data.data), file);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('listProducts')
  listProducts() {
    return this.productService.findAll({ moduls: 0 });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  update(@UploadedFiles() file, @Body() data, @Param('id') id: string) {
    return this.productService.update(id, JSON.parse(data.data), file);
  }
}
