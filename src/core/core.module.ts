import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { CourseModule } from './course/course.module';

@Module({
  imports: [UserModule, AuthModule, ProductModule, CourseModule],
  providers: [],
})
export class CoreModule {}
