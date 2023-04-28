import {
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs-extra';
import * as hbs from 'handlebars';
import * as path from 'path';
import configuration from '../../config';
import { CreatePaymentDto } from 'src/core/payments/dto/create-payment.dto';

@Injectable()
export class EmailService {
    constructor(
        @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
    ) { }

    createTransporter() {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: this.config.email.username,
                pass: this.config.email.password,
            },
            tls: { rejectUnauthorized: false },
        });
        return transporter;
    }

    async sendMailAdvisory(invoice: CreatePaymentDto) {
        const transporter = this.createTransporter();
        try {
            const emailTemplate = await this.compile('payment-email', invoice);
            await transporter.sendMail({
                from: 'Email test',
                to: invoice.customerData.email,
                subject: 'Compra exitosa.',
                html: emailTemplate,
            });
        } catch (error) {
            // Validar con carlos como agregar el mensaje.
            throw new InternalServerErrorException('Problema no controlado');
        }
    }

    async compile(templateName: string, data) {
        const filePath = path.join(
            process.cwd(),
            'templates',
            `${templateName}.hbs`,
        );
        const html = await fs.readFile(filePath, 'utf8');
        return hbs.compile(html, { strict: false })(data);
    }
}
