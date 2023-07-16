import { Module } from '@nestjs/common';
import { EmailService } from './service/email.service';
import { UploadImagesService } from './service/upload-images.service';
import { CitiesService } from './cities/service/cities.service';
import { CitiesController } from './cities/controller/cities.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CitySchema } from './cities/schema/cities.schema';
import { Prefix, PrefixSchema } from './prefixes/schema/prefix.schema';
import { PrefixesController } from './prefixes/controller/prefixes.controller';
import { PrefixesService } from './prefixes/service/prefixes.service';

@Module({
  providers: [EmailService, UploadImagesService, CitiesService, PrefixesService],
  imports : [
    MongooseModule.forFeature([
      { name: 'Cities', schema: CitySchema, collection: 'Cities' },
      { name: Prefix.name , schema: PrefixSchema }
    ]),
  ],
  controllers: [CitiesController, PrefixesController],
  exports: [EmailService, UploadImagesService, CitiesService],
})
export class SharedModule {}
