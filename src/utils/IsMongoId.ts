import mongoose from 'mongoose';

const isMongoId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

export default isMongoId;
