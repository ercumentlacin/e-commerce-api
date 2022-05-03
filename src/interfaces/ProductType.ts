import { Document } from 'mongoose';
import CommentType from './CommentType';

interface ProductType extends Document {
  comments: CommentType[];
  createdAt: Date;
  description: string;
  dislikes: number;
  image: string;
  likes: number;
  name: string;
  price: number;
  tags: string[];
  updatedAt: Date;
  attributes: {
    [key: string]: string;
  };
  pk?: number;
}

export default ProductType;
