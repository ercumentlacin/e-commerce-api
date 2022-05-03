import RoutingController, {
  ExpressMiddlewareInterface,
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from 'routing-controllers';
import UserModel from '@models/UserModel';
import UserType, { UserRoles } from '@interfaces/UserType';
import { Response } from 'express';
import createToken from '@utils/createToken';
import jwt, {
  JwtPayload,
  TokenExpiredError,
  VerifyCallback,
} from 'jsonwebtoken';

export class UserMiddlewares implements ExpressMiddlewareInterface {
  public async use(
    request: any,
    response: Response,
    next: Function
  ): Promise<void> {
    try {
      const user = await UserModel.findOne({ email: request.body.email });
      if (!user) {
        throw new BadRequestError('User does not exist');
      }
      const isValidPassword = await user.isValidPassword(request.body.password);
      if (!isValidPassword) {
        throw new BadRequestError('Invalid password');
      }
      const token = createToken(user);
      request.token = token;
      next();
    } catch (error) {
      if (error instanceof InternalServerError) {
        throw new InternalServerError(error.message);
      }
      throw new BadRequestError(error.message);
    }
  }
}

export class AdminMiddlewares implements ExpressMiddlewareInterface {
  public use(req: any, res: Response, next: (err?: any) => any): any {
    let token = req.headers['authorization'];

    if (!token) {
      res.status(401).send({
        message: 'No token provided',
      });
    }

    token = token.split(' ')[1];

    jwt.verify(
      token,
      process.env.JWT_SECRET,
      (
        err: TokenExpiredError,
        decoded: VerifyCallback<string | JwtPayload>
      ) => {
        if (err) {
          res.status(401).send({
            message: 'Unauthorized',
          });
        }
        req.user = decoded;
        next();
      }
    );
  }
}

export class IsAuthenticatedMiddlewares implements ExpressMiddlewareInterface {
  public use(req: any, res: Response, next: (err?: any) => any): any {
    if (!req.user) {
      return next(new RoutingController.HttpError(401, 'Unauthorized'));
    }
    return next();
  }
}
