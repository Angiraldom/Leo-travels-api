import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Model } from 'mongoose';

import { EmailService } from 'src/shared/service/email.service';
import configuration from '../../../config';
import { PotentialCustomer } from '../schema/potentialCustomers';
import { InjectModel } from '@nestjs/mongoose';
import { buildResponseSuccess } from 'src/shared/utils/utilities/Response.util';
import { IRequestResponse } from 'src/shared/utils/interface/IRequestResponse.interface';

@Injectable()
export class PotentialCustomerService {
  constructor(
    @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
    @InjectModel(PotentialCustomer.name)
    private readonly clientModel: Model<PotentialCustomer>,
    private emailService: EmailService,
  ) {}

  async sendEmailFreeClass(data) {
    await this.saveClient(data);
    
    data['urlFreeClass'] = this.config.appUrls.urlFreeClass;

    const configEmail = {
      subject: 'Aquí tienes tu acceso a la clase 📸💙',
      from: 'Vilean',
      to: data.email,
    };
    return await this.emailService.sendMail(configEmail, data, 'free-class');
  }

  async saveClient(data) {
    this.clientModel
    const NEW_CLIENT = new this.clientModel(data);
    await NEW_CLIENT.save();
  }

  async getAll(): Promise<IRequestResponse> {
    return buildResponseSuccess({
      data: await this.clientModel.find().sort({ createdAt: 1 }),
    });
  }
}
