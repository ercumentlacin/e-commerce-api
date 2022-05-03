import { Document } from 'mongoose';

interface CommentType extends Document {
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  user: string;
  stars: 0 | 1 | 2 | 3 | 4 | 5;
}

export default CommentType;
