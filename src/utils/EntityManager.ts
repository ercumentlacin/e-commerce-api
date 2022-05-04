import UserModel from '@models/UserModel';
import UserType, { UserRoles } from '@interfaces/UserType';
import jwt, {
  Jwt,
  JwtPayload,
  TokenExpiredError,
  VerifyCallback,
  VerifyErrors,
} from 'jsonwebtoken';

export default class EntityManager {
  public static async findByToken(token: string): Promise<UserType> {
    if (!token) return null;
    token = token.split(' ')[1];
    const decoded: JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as JwtPayload;
    if (!decoded) return null;
    const user = await UserModel.findById(decoded.id);
    if (!user) return null;
    return user;
  }
}
