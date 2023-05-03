import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [UserModule, PaymentsModule],
})
export class CoreModule {}
