import {
  Middleware,
  ExpressErrorMiddlewareInterface,
} from 'routing-controllers';

@Middleware({ type: 'after' })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
  error(error: any, request: any, response: any, next: Function): void {
    console.log('Error handled: ', error);
    next(error);
  }
}
