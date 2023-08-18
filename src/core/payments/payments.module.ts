import { Module } from '@nestjs/common';
import { PaymentsService } from './service/payments.service';
import { PaymentsController } from './controller/payments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schema/payment.schema';
import { RedisService } from 'src/shared/service/redis.service';
import { UserModule } from '../user/user.module';
import { SharedModule } from 'src/shared/shared.module';
import { CourseModule } from '../course/course.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema }
    ]),
    UserModule,
    SharedModule,
    CourseModule
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, RedisService]
})
export class PaymentsModule {}
