import { Inject, Injectable } from '@nestjs/common';
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
import { IEpayco } from '../interface/IResponseEpayco.interface';
import { ITransaction } from '../interface/IPayment.interface';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private readonly invoiceModel: Model<Payment>,
    @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
    private redisService: RedisService,
    private userService: UserService,
    private emailService: EmailService,
    private courseService: CourseService,
  ) {}

  async createPayment(createPayment: ITransaction) {
    const NEW_INVOICE = new this.invoiceModel(createPayment);
    await NEW_INVOICE.save();
  }

  async findAll(): Promise<IRequestResponse> {
    return buildResponseSuccess({
      data: await this.invoiceModel.find().sort({ fecha: -1 }),
    });
  }

  async getTransactionByFilter(filter): Promise<IRequestResponse> {
    return buildResponseSuccess({
      data: await this.invoiceModel.find(filter).sort({ fecha: -1 }),
    });
  }

  generatePasswordRandom() {
    const caracteres =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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

  /**
   * Envia el email al usuario cuando compro un curso.
   */
  async sendMailCourse(dataTransaction: ITransaction, passwordUser?: string) {
    const data = {
      name: dataTransaction.user.name,
      urlLogin: this.config.appUrls.urlLogin,
      products: [...dataTransaction.products],
      password: passwordUser,
      total: dataTransaction.total,
      reference: dataTransaction.reference,
      shippingPrice: dataTransaction.shippingPrice,
    };

    return await this.sendClientMail(
      'course-email',
      data,
      dataTransaction.user.email,
    );
  }

  /**
   * Envia el email al usuario cuando compro solamente productos.
   */
  async sendMailProducts(dataTransaction: ITransaction) {
    const data = {
      email: dataTransaction.user.email,
      products: [...dataTransaction.products],
      total: dataTransaction.total,
      reference: dataTransaction.reference,
      name: dataTransaction.user.name,
      shippingPrice: dataTransaction.shippingPrice,
    };

    return await this.sendClientMail(
      'products-email',
      data,
      dataTransaction.user.email,
    );
  }

  /**
   * Envia el email al cliente que hizo una compra.
   * @param templateName Nombre de la plantilla del correo.
   * @param data Información necesaria para el envio del email.
   * @param email Email al que se va hacer el envio.
   */
  async sendClientMail(templateName: string, data, email: string) {
    const configEmail = {
      subject: '¡PEDIDO CONFIRMADO! 🥳💙',
      from: 'Vilean',
      to: email,
    };
    const res = await this.emailService.sendMail(
      configEmail,
      data,
      templateName,
    );
    return buildResponseSuccess({
      data: res ?? 'The mail was send successfully',
    });
  }

  /**
   * Valida si en los productos comprados uno de estos es un curso.
   * @param data Productos comprados
   */
  validateRedisProduct(data: IProduct[]) {
    return data.some((element) => element.modules);
  }

  /**
   * Consulta todos los cursos comprados por el usario, para añadirlos a el.
   * @param data Productos comprados.
   * @returns Devuelve el objeto de base de datos de cada curso.
   */
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

  async createObjectWompi(payment: IWompi) {
    const total = payment.data.transaction.amount_in_cents.toString();
    const transactionObject: ITransaction = {
      gatewayData: payment,
      gateway: 'wompy',
      orden: payment.data.transaction.id,
      reference: payment.data.transaction.reference,
      fecha: payment.data.transaction.created_at,
      total: Number(total.slice(0, total.length - 2)),
      products: [],
      user: {
        name: payment.data.transaction.customer_data.full_name,
        email: payment.data.transaction.customer_email,
        typeDocument: payment.data.transaction.customer_data.legal_id_type,
        numberDocument: payment.data.transaction.customer_data.legal_id,
        phone: payment.data.transaction.customer_data.phone_number,
      },
    };
    if (payment.data.transaction.shipping_address) {
      transactionObject.shippingAdress = {
        country: payment.data.transaction.shipping_address.country,
        department: payment.data.transaction.shipping_address.region,
        city: payment.data.transaction.shipping_address.city,
        adress: payment.data.transaction.shipping_address.address_line_1,
        adressEspecification:
          payment.data.transaction.shipping_address.address_line_2,
      };
    }
    return await this.validate(transactionObject);
  }

  async createObjectEpayco(payment: IEpayco) {
    const customerData = JSON.parse(payment.x_extra1);
    const transactionObject: ITransaction = {
      gatewayData: payment,
      gateway: 'epayco',
      orden: payment.x_ref_payco.toString(),
      reference: payment.x_id_invoice,
      fecha: new Date(payment.x_transaction_date),
      total: payment.x_amount,
      products: [],
      user: {
        name: customerData.name,
        lastName: customerData.lastName,
        numberDocument: customerData.legalId,
        typeDocument: customerData.legalIdType,
        email: customerData.email,
        phone: customerData.phoneNumberPrefix + ' ' + customerData.phoneNumber,

      }
    };

    if (payment.x_extra2) {
      const shippingAdressData = JSON.parse(payment.x_extra2);
      transactionObject.shippingAdress = {
        country: shippingAdressData.country,
        department: shippingAdressData.region,
        city: shippingAdressData.city,
        adress: shippingAdressData.addressLine1,
        adressEspecification: shippingAdressData.addressLine2
      };
    }

    return await this.validate(transactionObject);
  }

  async validate(data: ITransaction) {
    const productosComprados = await this.redisService.getData(data.reference);

    data.products = JSON.parse(productosComprados).products;
    data.shippingPrice = JSON.parse(productosComprados).shippingPrice;

    const hasModules = this.validateRedisProduct(data.products);
    if (hasModules) {
      const hasUser = await this.userService.findUserByEmail(data.user.email);
      if (!hasUser) {
        const newUser: IUser = {
          name: data.user.name,
          password: this.generatePasswordRandom(),
          email: data.user.email,
          typeDocument: data.user.typeDocument,
          numberDocument: data.user.numberDocument,
          role: 'Cliente',
          phone: data.user.phone,
          courses: await this.getCourses(data.products),
        };
        const addNewUser = await this.userService.addUser(newUser);
        if (addNewUser.data) {
          await this.sendMailCourse(data, newUser.password);
        }
        await this.createPaymentRemoveProductsRedis(data);
        return;
      }
    }
    await this.sendMailProducts(data);
    await this.createPaymentRemoveProductsRedis(data);
  }

  async createPaymentRemoveProductsRedis(data: ITransaction) {
    await this.createPayment(data);
    await this.redisService.deleteRedisReference(data.reference);
  }

  async validateTransactionsWompi() {
    const fechaHoy = new Date();
    fechaHoy.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00 del día actual

    const resultado = await this.invoiceModel
      .aggregate([
        {
          $match: {
            fecha: {
              $gte: fechaHoy,
              $lt: new Date(fechaHoy.getTime() + 24 * 60 * 60 * 1000), // Hasta las 23:59:59
            },
            gateway: 'wompy'
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' },
          },
        },
      ])
      .exec();

    return buildResponseSuccess({
      data: resultado[0].total,
    });
  }
}
