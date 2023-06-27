import { Module } from '@nestjs/common';
import { CourseService } from './service/course.service';
import { CourseController } from './controller/course.controller';
import { SharedModule } from 'src/shared/shared.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './schema/course.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    SharedModule,
  ],
  controllers: [CourseController],
  providers: [CourseService]
})
export class CourseModule {}
