import jwt from 'jsonwebtoken';
import UserType, { UserRoles } from '@interfaces/UserType';

const createToken = (user: UserType) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role || UserRoles.USER,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h',
    }
  );
  return token;
};

export default createToken;
