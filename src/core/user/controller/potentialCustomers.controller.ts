import { Body, Controller, Get, Post, UseFilters, UseGuards } from "@nestjs/common";
import { HttpExceptionFilter } from "src/http-exception/http-exception.filter";
import { PotentialCustomerService } from "../service/potentialCustomer.service";
import { JwtAuthGuard } from "src/core/auth/guards/jwt-auth.guard";
import { Public } from "src/core/auth/decorators/public.decorator";

@UseFilters(HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
@Controller('client')
export class PotentialClientController {
  constructor(private readonly potentialCustomerService: PotentialCustomerService) {}

  @Public()
  @Post('clase-gratis')
  async freeClassEmail(@Body() data) {
    return await this.potentialCustomerService.sendEmailFreeClass(data);
  }

  @Get()
  async listAll() {
    return await this.potentialCustomerService.getAll();
  }
}
