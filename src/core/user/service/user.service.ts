import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

import { IUser } from '../interface/IUser.interface';
import { IRequestResponse } from './../../../shared/utils/interface/IRequestResponse.interface';
import { AddUserDto, UpdateUserDto } from '../dto';
import { validateAction } from '../../../shared/function/validateAction.function';
import { buildResponseSuccess } from '../../../shared/utils/utilities/Response.util';
import { encrypt } from '../../../shared/function/encryptPassword.function';
import { REQUIRED_PROPERTIES } from '../constant/fieldsValidation.constant';
import { EmailService } from 'src/shared/service/email.service';
import configuration from '../../../config';
import { IPayloadToken } from 'src/core/auth/interface/IPayloadToken.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
    @InjectModel('Users') private readonly userModel: Model<IUser>,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  /**
   * Method responsible for obtaining all users.
   * @returns {Promise<IRequestResponse>} - Response method.
   */
  async getAllUsers(): Promise<IRequestResponse> {
    return buildResponseSuccess({
      data: await this.userModel.find({}, { password: 0 }).sort({ name: 1 }),
    });
  }

  /**
   * Method responsible for creating a user.
   * @param {AddUserDto} user - Information user.
   * @returns {Promise<IRequestResponse>} - Response method.
   */
  async addUser(user: IUser): Promise<IRequestResponse> {
    //Validate user by identification.
    const EXIST_USER = await this.findUser({
      numberDocument: user.numberDocument,
    });

    await validateAction(
      true,
      EXIST_USER?._id,
      'The user is already registered.',
    );

    //Encrypt password.
    const PASSWORD = await encrypt(user?.password);

    //Save user.
    const NEW_USER = new this.userModel({ ...user, password: PASSWORD });
    await NEW_USER.save();

    return buildResponseSuccess({ code: 201, data: true });
  }

  /**
   *  Method responsible for update a user.
   * @param {UpdateUserDto} userToUpdate - User information to update.
   * @returns {Promise<IRequestResponse>} - Response method.
   */
  async updateUser(userToUpdate: UpdateUserDto): Promise<IRequestResponse> {
    //Check if userToUpdate has at least one "required" properties.
    await validateAction(
      false,
      Object.keys(userToUpdate).some((property) =>
        REQUIRED_PROPERTIES.has(property),
      ),
      'Verify the information provided. The values are not valid.',
    );

    //validate user by _id.
    const EXIST_USER = await this.findUser({
      _id: userToUpdate._id,
    });

    await validateAction(
      true,
      EXIST_USER?._id === undefined,
      'The user does not exist.',
    );

    //Update user.
    await this.userModel.findByIdAndUpdate(userToUpdate._id, userToUpdate, {
      new: true,
    });

    return buildResponseSuccess({
      data: true,
    });
  }

  /**
   * Function generic to verify that the user is not registered.
   * @param {any} objSearch - Objection to search.
   * @returns {Promise<{_id}>} - A _id if the user exists.
   */
  private async findUser(objSearch: any): Promise<{ _id }> {
    return this.userModel.findOne(objSearch, { _id: 1 });
  }

  /**
   * Function generic to find a user by email.
   * @param {string} email - Email to search.
   * @returns {Promise<{_id}>} - A _id if the user exists.
   */
  async findUserByEmail(email: string): Promise<IUser> {
    return this.userModel.findOne({ email }).lean();
  }

  /**
   * Function generic to find a user by email.
   * @param {string} email - Email to search.
   * @returns {Promise<{_id}>} - A _id if the user exists.
   */
  async findUserById(id: string) {
    const user = await this.userModel.findById(id, { password: 0 });

    if (!user) {
      throw new HttpException("The user doesn't exist", HttpStatus.NOT_FOUND);
    }

    return buildResponseSuccess({
      data: user,
    });
  }

  /**
   * Send email for reseting password.
   * @param email Verificate the email.
   */
  async sendEmail(email: string) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException({
        customMessage: 'El email no existe',
        tag: 'ErrorEmailNotFound',
      });
    }
    const token = this.generateTokenPassword(user);
    const data = {
      ...user,
      link: `http://localhost:4200/change-password?token=${token}`,
    };
    console.log(data);
    
    const configEmail = {
      subject: 'Cambio de contraseña',
      from: 'Email test',
      to: data.email,
    };
    const res = await this.emailService.sendMail(
      configEmail,
      data,
      'forgot-password',
    );
    return buildResponseSuccess({
      data: res ?? 'The mail was send successfully',
    });
  }

  /**
   * Generate token for changing password.
   */
  generateTokenPassword(user: IUser) {
    const token = this.jwtService.sign(
      { sub: user._id },
      {
        secret: this.config.jwtSecretRecoverPassword,
        expiresIn: '20min',
      },
    );
    return token;
  }

  async changePassword(password: string, token: string) {
    const payload: IPayloadToken = this.jwtService.verify(token, {
      secret: this.config.jwtSecretRecoverPassword,
    });
    const hasPassword = await encrypt(password);
    const userUpdate = await this.userModel.findByIdAndUpdate(payload.sub, {
      password: hasPassword,
      _id: payload.sub,
    });

    return buildResponseSuccess({
      data: userUpdate ?? 'The password was change succesful',
    });
  }
}
