import { HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { response } from 'express';
import { ConfigType } from '@nestjs/config';

import { Payment } from '../schema/payment.schema';
import { RedisService } from 'src/shared/service/redis.service';
import { UserService } from 'src/core/user/service/user.service';
import { EmailService } from 'src/shared/service/email.service';
import { buildResponseSuccess } from 'src/shared/utils/utilities/Response.util';
import { IRequestResponse } from 'src/shared/utils/interface/IRequestResponse.interface';
import { IWompi } from '../interface/IResponseWompi.interface';
import { IProduct } from 'src/core/product/interface/IProduct.interface';
import { IUser } from 'src/core/user/interface/IUser.interface';
import configuration from '../../../config';
import { CourseService } from 'src/core/course/service/course.service';

@Injectable()
export class PaymentsService {
  constructor(@InjectModel(Payment.name) private readonly invoiceModel: Model<Payment>,
  @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
    private redisService: RedisService,
    private userService: UserService,
    private emailService: EmailService,
    private courseService: CourseService) { }

  async create(createPayment: IWompi) {
    const NEW_INVOICE = new this.invoiceModel(createPayment);
    await NEW_INVOICE.save();
  }

  async findAll(): Promise<IRequestResponse> {
    return buildResponseSuccess({
      data: await this.invoiceModel.find(),
    });
  }

  async validateWompi(data: IWompi) {

    if (data.data.transaction.status != "APPROVED") {
      return response.status(HttpStatus.OK);
    }
    const productsRedis = await this.redisService.getData(data.data.transaction.reference);

    data.products = JSON.parse(productsRedis).products;

    const hasModules = this.validateRedisProduct(data.products);
    if (hasModules) {
      const hasUser = await this.userService.findUserByEmail(data.data.transaction.customer_email);
      if (!hasUser) {
        const newUser: IUser = {
          name: data.data.transaction.customer_data.full_name,
          password: this.generatePasswordRandom(),
          email: data.data.transaction.customer_email,
          typeDocument: data.data.transaction.customer_data.legal_id_type,
          numberDocument: data.data.transaction.customer_data.legal_id,
          role: "Cliente",
          phone: data.data.transaction.customer_data.phone_number,
          courses: await this.getCourses(data.products)
        };
        const addNewUser = await this.userService.addUser(newUser);
        if (addNewUser.data) {
          await this.sendMailProducts(data, newUser.password);
        }
        return response.status(201);
      }
    }
    await this.sendMailProductsIndependent(data);
    await this.create(data);
    this.redisService.deleteRedisReference(data.data.transaction.reference);
  }

  generatePasswordRandom() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const caracteresLength = caracteres.length;
    let pass = '';

    for (let i = 0; i < 10; i++) {
      const indice = Math.floor(Math.random() * caracteresLength);
      pass += caracteres.charAt(indice);
    }

    const timestamp = Date.now().toString(36);
    pass += '-' + timestamp;

    return pass;
  }

  getTotalValue(products: any[]) {
    const total: number = products.reduce((value, item) => {
      const price = item.price * item.amount;
      return value = price + value;
    }, 0)
    return total;
  }

  async sendMailProducts(dataTransaction: IWompi, passwordUser?: string) {
    const user = await this.userService.findUserByEmail(dataTransaction.data.transaction.customer_email);
    if (!user) {
      throw new NotFoundException({
        customMessage: 'El email no existe',
        tag: 'ErrorEmailNotFound',
      });
    }
    const data = {
      ...user,
      urlLogin : this.config.urlLogin,
      products: [...dataTransaction.products],
      password: passwordUser,
      total: dataTransaction.data.transaction.amount_in_cents,
      transaction: dataTransaction.data
    };

    const configEmail = {
      subject: '¡PEDIDO CONFIRMADO! 🥳💙',
      from: 'Vilean',
      to: data.email,
    };
    const res = await this.emailService.sendMail(
      configEmail,
      data,
      'send-buy-products',
    );
    return buildResponseSuccess({
      data: res ?? 'The mail was send successfully',
    });
  }

  async sendMailProductsIndependent(dataTransaction: IWompi) {
    const data = {
      email: dataTransaction.data.transaction.customer_email,
      products: [...dataTransaction.products],
      total: dataTransaction.data.transaction.amount_in_cents,
      transaction: dataTransaction.data,
      name: dataTransaction.data.transaction.customer_data.full_name
    };

    const configEmail = {
      subject: '¡PEDIDO CONFIRMADO! 🥳💙',
      from: 'Vilean',
      to: data.email,
    };
    const res = await this.emailService.sendMail(
      configEmail,
      data,
      'confirm-buy-products',
    );
    return buildResponseSuccess({
      data: res ?? 'The mail was send successfully',
    });
  }

  validateRedisProduct(data: IProduct[]) {
    return data.some((element) => element.modules)
  }

  async getCourses(data?: IProduct[]) {
    const courses = data.filter((product) => product.modules);

    if (!courses) {
      return [];
    }
    
    const coursesPromises = courses.map(async (file) => {
      return await this.courseService.findCourseAndAddField(file._id);
    });

    const responseCourses = await Promise.all(coursesPromises);

    return responseCourses.filter((item) => item);
  }
}
