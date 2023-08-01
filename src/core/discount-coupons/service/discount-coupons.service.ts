import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateDiscountCouponDto } from '../dto/create-discount-coupon.dto';
import { UpdateDiscountCouponDto } from '../dto/update-discount-coupon.dto';
import { DiscountCoupon } from '../schema/discount-coupon.schema';
import { buildResponseSuccess } from 'src/shared/utils/utilities/Response.util';


@Injectable()
export class DiscountCouponsService {

  constructor(
    @InjectModel(DiscountCoupon.name)
    private readonly discountCouponModel: Model<CreateDiscountCouponDto>,
  ) {}

  async create(createDiscountCouponDto: CreateDiscountCouponDto) {
    const newCoupon = new this.discountCouponModel(createDiscountCouponDto);
    await newCoupon.save();

    return buildResponseSuccess({
      data: newCoupon,
    });
  }

  async findAll() {
    const copuns = await this.discountCouponModel.find();

    return buildResponseSuccess({
      data: copuns,
    });
  }

  async findOne(coupon: string) {
    const res = await this.discountCouponModel.findOne({
      coupon,
      startDate: {
        $lte: new Date()
      },
      endDate: {
        $gte: new Date()
      }
    });

    return buildResponseSuccess({
      data: res,
    });
  }

  async update(id: string, updateDiscountCouponDto: UpdateDiscountCouponDto) {
    await this.discountCouponModel.findByIdAndUpdate(id, { ...updateDiscountCouponDto });

    return buildResponseSuccess({
      data: 'Actualizado correctamente.',
    });
  }

  async remove(id: string) {
    await this.discountCouponModel.findByIdAndRemove(id);
    return buildResponseSuccess({
      data: 'Eliminado correctamente.',
    });
  }
}
