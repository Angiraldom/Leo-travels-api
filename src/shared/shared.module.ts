import { Module } from '@nestjs/common';
import { EmailService } from './service/email.service';
import { UploadImagesService } from './service/upload-images.service';
import { CitiesService } from './cities/service/cities.service';
import { CitiesController } from './cities/controller/cities.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CitySchema } from './cities/schema/cities.schema';

@Module({
  providers: [EmailService, UploadImagesService, CitiesService],
  imports : [
    MongooseModule.forFeature([
      { name: 'Cities', schema: CitySchema, collection: 'Cities' },
    ]),
  ],
  controllers: [CitiesController],
  exports: [EmailService, UploadImagesService, CitiesService],
})
export class SharedModule {}
