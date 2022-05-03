import {
  BadRequestError,
  HttpError,
  JsonController,
  InternalServerError,
} from 'routing-controllers';

import ProductModel from '@models/ProductModel';
import ProductType from '@interfaces/ProductType';
import {
  createProductValidator,
  updateProductValidator,
} from '@validators/ProductValidator';
import DbError from '@errors/DbError';

// @JsonController('/products')
export default class ProductService {
  public static async getAll(): Promise<BadRequestError | ProductType[]> {
    try {
      return await ProductModel.find();
    } catch (error) {
      throw new DbError('getAll', [error]);
    }
  }

  public static async getOne(id: number): Promise<ProductType> {
    try {
      return await ProductModel.findById(id);
    } catch (error) {
      throw new DbError('getOne', [error]);
    }
  }

  public static async create(
    product: ProductType
  ): Promise<BadRequestError | InternalServerError | ProductType> {
    try {
      const validation = await createProductValidator.validate(product);
      if (validation.error) {
        return new BadRequestError(validation.error.details[0].message);
      }
      return await ProductModel.create(product);
    } catch (error: unknown | BadRequestError | InternalServerError) {
      if (
        error instanceof BadRequestError ||
        error instanceof InternalServerError
      ) {
        throw new BadRequestError(error.message);
      } else {
        throw new InternalServerError("Can't create product");
      }
    }
  }

  public static async update(
    id: number,
    product: ProductType
  ): Promise<ProductType | void> {
    try {
      const validation = await updateProductValidator.validate(product);
      if (validation.error) {
        throw new HttpError(400, validation.error.details[0].message);
      }
      return await ProductModel.findOneAndUpdate({ id }, product, {
        new: true,
      });
    } catch (error) {
      throw new DbError('update', [error]);
    }
  }

  public static async delete(id: number): Promise<ProductType> {
    try {
      return await ProductModel.findByIdAndRemove(id);
    } catch (error) {
      throw new DbError('delete', [error]);
    }
  }
}
