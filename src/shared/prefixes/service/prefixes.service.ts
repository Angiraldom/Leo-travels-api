import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Prefix } from '../schema/prefix.schema';
import { buildResponseSuccess } from 'src/shared/utils/utilities/Response.util';

@Injectable()
export class PrefixesService {

  constructor(
    @InjectModel(Prefix.name) private readonly prefixModel: Model<Prefix>
  ) {}

  async findAll() {
    const prefixes = await this.prefixModel.find();
    return buildResponseSuccess({
      data: prefixes,
    });
  }
}
