import {
  BadRequestException,
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
import { UpdateUserDto } from '../dto';
import { validateAction } from '../../../shared/function/validateAction.function';
import { buildResponseSuccess } from '../../../shared/utils/utilities/Response.util';
import { comparePassword, encrypt } from '../../../shared/function/encryptPassword.function';
import { REQUIRED_PROPERTIES } from '../constant/fieldsValidation.constant';
import { EmailService } from 'src/shared/service/email.service';
import configuration from '../../../config';
import { IPayloadToken } from 'src/core/auth/interface/IPayloadToken.interface';
import { ClassDto } from 'src/core/course/dto/class.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
    @InjectModel('Users') private readonly userModel: Model<IUser>,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) { }

  /**
   * Method responsible for obtaining all users.
   * @returns {Promise<IRequestResponse>} - Response method.
   */
  async getAllUsers(): Promise<IRequestResponse> {
    return buildResponseSuccess({
      data: await this.userModel.find({}, { password: 0 }).sort({ createdAt: -1 }),
    });
  }

  /**
   * Method responsible for obtaining users with the filter.
   * @returns {Promise<IRequestResponse>} - Response method.
   */
  async getUserFilter(filter): Promise<IRequestResponse> {
    return buildResponseSuccess({
      data: await this.userModel.find(filter, { password: 0 }).sort({ createdAt: -1 }),
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
      email: user.email,
    });

    await validateAction(
      true,
      EXIST_USER?._id,
      'The user is already registered.',
    );

    //Encrypt password.
    const PASSWORD = await encrypt(user?.password);
    //Save user.
    const NEW_USER = new this.userModel({ ...user, createdAt: new Date(), password: PASSWORD });
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
      data: userToUpdate,
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
    const urlLogin = this.config.appUrls.urlChangePassword;
    const data = {
      ...user,
      link: `${urlLogin}?token=${token}`,
    };
  
    const configEmail = {
      subject: 'Cambio de contraseña',
      from: 'Vilean',
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

  async recoveryPassword(password: string, token: string) {
    const payload: IPayloadToken = this.jwtService.verify(token, {
      secret: this.config.jwtSecretRecoverPassword,
      ignoreExpiration: false
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

  async changePassword(actualPassword: string, newPassword: string, id: string) {
    const userBd = await this.userModel.findById(id);
    if (userBd && actualPassword) {
      const confirmPassword = await comparePassword(actualPassword, userBd.password);
      if (!confirmPassword) {

        throw new BadRequestException({
          customMessage: "The current password does not match ",
          tag: 'ErrorPasswordNotMatch',
        });
      }
      await this.userModel.findByIdAndUpdate(id, {
        password: await encrypt(newPassword)
      });
      return buildResponseSuccess({
        data: 'The password was change succesful'
      });
    }
    throw new BadRequestException({
      customMessage: "User id and actual password is required",
      tag: 'ErrorFieldRequired',
    });
  }

  /**
   Filter user by email.
   * @param email Email to search.
   * @returns The user.
   */
  async findByEmail(email: string): Promise<IRequestResponse> {
    return buildResponseSuccess({
      data: await this.userModel.findOne({
        email
      }, { password: 0 })
    });
  }

  /**
   * Update the state class for completed or uncompleted.
   * @param idCourse 
   * @param idModule 
   * @param idClass 
   * @param data 
   * @returns 
   */
  async updateClass(
    idCourse: string,
    idModule: string,
    idClass: string,
    idUser: string,
    data: ClassDto,
  ) {
    const user = await this.userModel.findById(idUser);

    const course = user.courses?.find((itemCourse) => itemCourse._id == idCourse);

    const module = course?.modules?.find((module) => module._id === idModule);
    module.classes = module?.classes?.map((item) => {
      if (item._id === idClass) {
        item = { ...item, ...data };
      }
      return item;
    });
    user.markModified('courses');
    user.markModified('modules');
    user.markModified('classes');
    await user.save();
    return buildResponseSuccess({
      data: 'Actualizado exitosamente',
    });
  }

  async getAllStudents() {
    const students = await this.userModel.find({ role: 'Cliente', courses: { $exists: true } }, { courses: 1, name: 1 }).lean();
    const response = {
      totalUsers: students.length,
      usersStartedCourse: 0,
      usersCompletedCourse: 0
    };

    response.usersStartedCourse = students.filter((user) => {
      // Get photography course
      return user.courses[0].modules.find((module) => {
        return module.classes.some((itemClass) => itemClass.completed);
      });
    }).length;

    response.usersCompletedCourse = students.filter((user) => {
      // Get photography course
      return user.courses[0].modules.every((module) => {
        return module.classes.every((itemClass) => itemClass.completed);
      });
    }).length;

    return buildResponseSuccess({
      data: response,
    });
  }
}