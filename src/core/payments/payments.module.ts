import { Module } from '@nestjs/common';
import { PaymentsService } from './service/payments.service';
import { PaymentsController } from './controller/payments.controller';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService]
})
export class PaymentsModule {}
