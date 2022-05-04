import {
  Authorized,
  BadRequestError,
  Body,
  CurrentUser,
  Delete,
  ForbiddenError,
  Get,
  InternalServerError,
  JsonController,
  OnUndefined,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseAfter,
  UseBefore,
  HttpError,
} from 'routing-controllers';
import UserService from '@services/UserService';
import UserType from '@interfaces/UserType';
import { NextFunction, Response, Request } from 'express';
import {
  UserMiddlewares,
  AdminMiddlewares,
  IsAuthenticatedMiddlewares,
} from '@middlewares/UserMiddlewares';
import * as UserValidator from '@validators/UserValidator';
import UserModel from '@models/UserModel';
import createToken from '@utils/createToken';
import isMongoId from '@utils/IsMongoId';

@JsonController('/users')
export default class UserController {
  @Get('/:id')
  public async getUser(
    @Param('id') id: string,
    @Res() response: Response
  ): Promise<Response<UserType>> {
    if (!isMongoId(id)) throw new BadRequestError('Invalid id');

    const user = await UserService.getUser(id);
    if (!user) throw new ForbiddenError('User does not exist');

    return response.status(200).send(user);
  }

  @Post('/register')
  public async register(
    @Body()
    user: UserType,
    @Res() response: Response
  ): Promise<Response<UserType>> {
    const { error } = UserValidator.register.validate(user);
    if (error) throw new BadRequestError(error.details[0].message);

    const userExists = await UserModel.findOne({ email: user.email });
    if (userExists) throw new BadRequestError('User already exists');

    const newUser = await UserService.register(user);
    return response.status(201).send(newUser);
  }

  @Post('/login')
  public async login(
    @Body() user: UserType,
    @Res() response: Response
  ): Promise<Response<UserType>> {
    const { error } = UserValidator.login.validate(user);
    if (error) throw new BadRequestError(error.details[0].message);

    const userExists = await UserService.login(user);
    console.log('userExists :>> ', userExists);
    if (!userExists) throw new BadRequestError('User does not exist');

    const isValidPassword = await userExists.isValidPassword(user.password);
    if (!isValidPassword) throw new BadRequestError('Invalid password');

    const token = createToken(userExists);
    return response.status(200).send({ token });
  }

  @Put('/:id')
  public async updateUser(
    @CurrentUser() currentUser: UserType,
    @Param('id') id: string,
    @Body() user: UserType
  ): Promise<UserType> {
    if (!isMongoId(id)) throw new BadRequestError('Invalid id');

    if (!currentUser) throw new HttpError(401, 'Unauthorized');

    if (currentUser.id !== id) {
      throw new ForbiddenError('You can only update your own account');
    }

    const { error } = UserValidator.updateUser.validate(user);
    if (error) throw new BadRequestError(error.details[0].message);

    const updatedUser = await UserService.updateUser(id, user);
    return updatedUser;
  }

  @Delete('/:id')
  @UseBefore(AdminMiddlewares)
  public async deleteUser(
    @Param('id') id: string,
    @Res() response: Response
  ): Promise<Response<UserType>> {
    if (!isMongoId(id)) throw new BadRequestError('Invalid id');

    const isExist = await UserService.deleteUser(id);
    if (!isExist) throw new BadRequestError('User does not exist');

    return response.status(200).send(isExist);
  }

  @Get('/')
  public async allUsers(
    @Res() response: Response
  ): Promise<Response<UserType[]>> {
    const users = await UserService.allUsers();
    return response.status(200).send(users);
  }
}
