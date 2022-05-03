import {
  BadRequestError,
  Body,
  Delete,
  Get,
  InternalServerError,
  JsonController,
  Param,
  Post,
  Put,
  Res,
} from 'routing-controllers';
import ProductService from '@services/ProductService';
import ProductType from '@interfaces/ProductType';
import { Response } from 'express';

@JsonController('/products')
export default class ProductController {
  @Get('')
  async getAll(@Res() response: Response) {
    const products = await ProductService.getAll();
    if (!products) {
      throw new Error('No products found');
    }
    return response.status(200).send(products);
  }

  @Get('/:id')
  async getOne(@Param('id') id: number) {
    return await ProductService.getOne(id);
  }

  @Post('')
  async create(@Res() response: Response, @Body() product: ProductType) {
    const post = await ProductService.create(product);
    if (
      post instanceof BadRequestError ||
      post instanceof InternalServerError
    ) {
      return response.status(post.httpCode).send(post);
    }

    return response.status(201).send(post);
  }

  @Put('/:id')
  async update(@Param('id') id: number, @Body() product: ProductType) {
    return await ProductService.update(id, product);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return await ProductService.delete(id);
  }
}
