import {
  BadRequestError,
  HttpError,
  InternalServerError,
} from 'routing-controllers';

import UserModel from '@models/UserModel';
import UserType from '@interfaces/UserType';
import * as UserValidator from '@validators/UserValidator';
import DbError from '@errors/DbError';
import createToken from '@utils/createToken';

export default class UserService {
  public static async register(user: UserType): Promise<UserType | Error> {
    return await UserModel.create(user);
  }

  public static async login(user: UserType): Promise<UserType> {
    return await UserModel.findOne({ email: user.email });
  }

  public static async getUser(id: string): Promise<UserType> {
    return await UserModel.findById(id);
  }

  public static async updateUser(
    id: string,
    user: UserType
  ): Promise<UserType> {
    return await UserModel.findByIdAndUpdate(id, user, {
      new: true,
    });
  }

  public static async deleteUser(id: string): Promise<UserType> {
    return await UserModel.findByIdAndDelete(id);
  }

  public static async allUsers(): Promise<UserType[]> {
    return await UserModel.find();
  }
}
