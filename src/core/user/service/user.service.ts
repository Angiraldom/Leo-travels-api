import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { IUser } from '../interface/IUser.interface';
import { IRequestResponse } from './../../../shared/utils/interface/IRequestResponse.interface';
import { AddUserDto, DeleteUserDto, UpdateUserDto } from '../dto';
import { validateAction } from '../../../shared/function/validateAction.function';
import {
  buildResponseCreate,
  buildResponseFail,
  buildResponseSuccess,
} from '../../../shared/utils/utilities/Response.util';
import { encrypt } from '../../../shared/function/encryptPassword.function';
import { REQUIRED_PROPERTIES } from '../constant/fieldsValidation.constant';

@Injectable()
export class UserService {
  constructor(@InjectModel('Users') private readonly userModel: Model<IUser>) {}

  /**
   * Method responsible for obtaining all users.
   * @returns {Promise<IRequestResponse>} - Response method.
   */
  async getAllUsers(): Promise<IRequestResponse> {
    let response: IRequestResponse;
    try {
      const ALL_USERS = await this.userModel
        .find({}, { password: 0 })
        .sort({ name: 1 });
      response = buildResponseSuccess({
        data: ALL_USERS,
      });
    } catch (error) {
      response = buildResponseFail({
        msg: error.message,
        state: false,
      });
    }
    return response;
  }

  /**
   * Method responsible for creating a user.
   * @param {AddUserDto} user - Information user.
   * @returns {Promise<IRequestResponse>} - Response method.
   */
  async addUser(user: AddUserDto): Promise<IRequestResponse> {
    let response: IRequestResponse;
    try {
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

      response = buildResponseCreate({ data: true });
    } catch (error) {
      response = buildResponseFail({
        msg: error.message,
        state: false,
      });
    }
    return response;
  }

  /**
   *  Method responsible for update a user.
   * @param {UpdateUserDto} userToUpdate - User information to update.
   * @returns {Promise<IRequestResponse>} - Response method.
   */
  async updateUser(userToUpdate: UpdateUserDto): Promise<IRequestResponse> {
    let response: IRequestResponse;
    try {
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

      response = buildResponseSuccess({
        data: true,
      });
    } catch (error) {
      response = buildResponseFail({
        msg: error.message,
        state: false,
      });
    }
    return response;
  }

  /**
   * Method responsible for delete a user.
   * @param {DeleteUserDto} userToDelete - User information to delete.
   * @returns {Promise<IRequestResponse>} - Response method.
   */
  async deleteUser(userToDelete: DeleteUserDto): Promise<IRequestResponse> {
    let response: IRequestResponse;
    try {
      const { _id } = userToDelete;

      //validate user by _id.
      const EXIST_USER = await this.findUser({
        _id,
      });

      await validateAction(
        true,
        EXIST_USER?._id === undefined,
        'The user does not exist.',
      );

      //Delete user.
      await this.userModel.findByIdAndDelete(_id);

      response = buildResponseSuccess({
        data: true,
      });
    } catch (error) {
      response = buildResponseFail({
        msg: error.message,
        state: false,
      });
    }
    return response;
  }

  /**
   * Function generic to verify that the user is not registered.
   * @param {any} objSearch - Objection to search.
   * @returns {Promise<{_id}>} - A _id if the user exists.
   */
  private async findUser(objSearch: any): Promise<{ _id }> {
    try {
      return this.userModel.findOne(objSearch, { _id: 1 });
    } catch (error) {
      throw new HttpException(
        'An error has occurred when looking for the user.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
