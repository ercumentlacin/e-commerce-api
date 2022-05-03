import ProductType from '@interfaces/ProductType';
import { Schema, model } from 'mongoose';

const ProductSchema = new Schema(
  {
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      required: true,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    tags: [
      {
        type: String,
        required: true,
      },
    ],
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    attributes: {
      type: Object,
      required: true,
    },
    pk: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.pre('save', async function (next) {
  const smallestPk = await ProductModel.find({
    pk: { $exists: true },
  })
    .sort({ pk: -1 })
    .limit(1);
  const pkNumber = smallestPk.length ? smallestPk[0].pk + 1 : 1;
  this.pk = pkNumber;
  next();
});

const ProductModel = model<ProductType>('Product', ProductSchema);
export default ProductModel;
