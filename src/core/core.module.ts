import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { CourseModule } from './course/course.module';
import { PaymentsModule } from './payments/payments.module';
import { CommentsModule } from './comments/comments.module';
import { DiscountCouponsModule } from './discount-coupons/discount-coupons.module';

@Module({
  imports: [UserModule, AuthModule, ProductModule, CourseModule, PaymentsModule, CommentsModule, DiscountCouponsModule],
  providers: [],
})
export class CoreModule {}
