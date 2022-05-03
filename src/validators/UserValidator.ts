import Joi, { ObjectSchema } from 'joi';
import UserType, { UserRoles } from '@interfaces/UserType';

type IRegister = Pick<UserType, 'name' | 'email' | 'password'>;
type ILogin = Pick<UserType, 'email' | 'password'>;

const register: ObjectSchema<IRegister> = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  name: Joi.string().required(),
});

const login: ObjectSchema<ILogin> = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateUser: ObjectSchema<Partial<UserType>> = Joi.object().keys({
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
  image: Joi.string(),
  role: Joi.string(),
});

const deleteUser: ObjectSchema<Pick<UserType, '_id'>> = Joi.object().keys({
  _id: Joi.string().required(),
});

export { register, login, updateUser, deleteUser };
