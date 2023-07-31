import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UseGuards } from '@nestjs/common';
import { DiscountCouponsService } from '../service/discount-coupons.service';
import { CreateDiscountCouponDto } from '../dto/create-discount-coupon.dto';
import { UpdateDiscountCouponDto } from '../dto/update-discount-coupon.dto';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { HttpExceptionFilter } from 'src/http-exception/http-exception.filter';

@UseFilters(HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
@Controller('discount-coupons')
export class DiscountCouponsController {
  constructor(private readonly discountCouponsService: DiscountCouponsService) {}

  @Post()
  create(@Body() createDiscountCouponDto: CreateDiscountCouponDto) {
    return this.discountCouponsService.create(createDiscountCouponDto);
  }

  @Get()
  findAll() {
    return this.discountCouponsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discountCouponsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiscountCouponDto: UpdateDiscountCouponDto) {
    return this.discountCouponsService.update(id, updateDiscountCouponDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discountCouponsService.remove(id);
  }
}
