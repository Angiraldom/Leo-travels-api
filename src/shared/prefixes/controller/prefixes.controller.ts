import { Controller, Get } from '@nestjs/common';
import { PrefixesService } from '../service/prefixes.service';

@Controller('prefixes')
export class PrefixesController {
  constructor(private readonly prefixesService: PrefixesService) {}

  @Get()
  findAll() {
    return this.prefixesService.findAll();
  }
}
