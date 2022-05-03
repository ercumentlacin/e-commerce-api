import { Document } from 'mongoose';
import ProductType from './ProductType';
import CommentType from './CommentType';

export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
}

interface UserType extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string;
  role: UserRoles;
  basket?: [
    {
      product: ProductType;
      quantity: number;
    }[]
  ];
  orders?: [
    {
      product: ProductType;
      quantity: number;
      orderDate: Date;
    }[]
  ];
  comments?: [
    {
      product: ProductType;
      comment: CommentType;
      createdAt: Date;
    }[]
  ];
  isValidPassword(password: string): Promise<Error | boolean>;
}

export default UserType;
