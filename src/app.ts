import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import 'dotenv/config';
import { useExpressServer, Action } from 'routing-controllers';

import UserController from '@controllers/UserController';
import ProductController from '@controllers/ProductController';
import initializeDatabaseConnection from '@utils/connectDB';
import { UserRoles } from '@interfaces/UserType';
import jwt from 'jsonwebtoken';
import UserModel from '@models/UserModel';
import EntityManager from '@utils/EntityManager';

const app = express();

app.use(compression()).use(morgan('dev'));
initializeDatabaseConnection();

const currentUserChecker = async (action: Action) => {
  const token = action.request.headers['authorization'] as string | undefined;
  if (!token) return false;
  const user = await EntityManager.findByToken(token);
  if (!user) return false;
  return user;
};

useExpressServer(app, {
  routePrefix: '/api/v1',
  controllers: [UserController, ProductController],
  middlewares: [],
  currentUserChecker,
  authorizationChecker: async (action: Action, roles: string[]) => {
    const user = await EntityManager.findByToken(
      action.request.headers['authorization'] as string
    );
    if (user && !roles.length) return true;
    if (user && roles.find((role) => user.role.indexOf(role) !== -1))
      return true;

    return false;
  },
});

export default app;
