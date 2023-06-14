import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs-extra';
import * as hbs from 'handlebars';
import * as path from 'path';

import configuration from '../../config';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
  constructor(
    @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
  ) {}

  createTransporter() {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'theo.eichmann@ethereal.email',
        pass: 'TQsc76J7pHMRXddNEa'
      },
    });
    return transporter;
    // const transporter = nodemailer.createTransport({
    //   host: 'smtp.gmail.com',
    //   port: 465,
    //   secure: true,
    //   auth: {
    //     user: this.config.email.username,
    //     pass: this.config.email.password,
    //   },
    //   tls: { rejectUnauthorized: false },
    // });
    // return transporter;
  }

  async sendMail(
    configMail: Mail.Options,
    data: unknown,
    templateName: string,
  ) {
    const transporter = this.createTransporter();
    const emailTemplate = await this.compile(templateName, data);
    const responseEmail = await transporter.sendMail({
      ...configMail,
      html: emailTemplate,
    });
    return responseEmail;
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
