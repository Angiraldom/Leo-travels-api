import { Module } from '@nestjs/common';
import { DiscountCouponsService } from './service/discount-coupons.service';
import { DiscountCouponsController } from './controller/discount-coupons.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscountCoupon, DiscountCouponSchema } from './schema/discount-coupon.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DiscountCoupon.name, schema: DiscountCouponSchema }]),
  ],
  controllers: [DiscountCouponsController],
  providers: [DiscountCouponsService]
})
export class DiscountCouponsModule {}
