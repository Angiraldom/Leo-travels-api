import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { PaymentsModule } from './payments/payments.module';
@Module({
  imports: [UserModule, ProductModule, PaymentsModule],
})
export class CoreModule {}
