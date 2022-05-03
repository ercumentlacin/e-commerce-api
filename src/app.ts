import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import 'dotenv/config';
import { useExpressServer } from 'routing-controllers';

import UserController from '@controllers/UserController';
import ProductController from '@controllers/ProductController';
import initializeDatabaseConnection from '@utils/connectDB';

const app = express();

app.use(compression()).use(morgan('dev'));
initializeDatabaseConnection();

useExpressServer(app, {
  routePrefix: '/api/v1',
  controllers: [UserController, ProductController],
  middlewares: [],
});

export default app;
