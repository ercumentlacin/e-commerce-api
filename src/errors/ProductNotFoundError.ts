import { HttpError } from 'routing-controllers';

export default class ProductNotFoundError extends HttpError {
  constructor() {
    super(404, 'Product not found!');
  }
}
