import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { celebrate, errors, Joi } from 'celebrate';
import { JwtPayload } from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { MongoServerError } from 'mongodb';

import auth from './middlewares/auth';

import usersRouter from './routes/users';
import moviesRouter from './routes/movies';
import { createUser, login, logout } from './controllers/auth';

import NotFoundError from './errors/error-404-not-found';
import BadRequestError from './errors/error-400-bad-request';
import UnauthorizedError from './errors/error-401-unauthorized';
import ForbiddenChangesError from './errors/error-403-forbidden';
import UniqueFieldConflict from './errors/error-409-conflict';
import InternalServerError from './errors/error-500-internal-server-error';

import { requestLogger, errorLogger } from './middlewares/logger';

require('dotenv').config();

const { PORT = 3000 } = process.env;

const runApp = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Логер запросов до всех роутов
  app.use(requestLogger);

  // Роуты регистрации и авторизации
  app.post('/signup', celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(4),
      name: Joi.string().min(2).max(30),
    }),
  }), createUser);

  app.post('/signin', celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(4),
    }),
  }), login);

  // Защита роутов авторизацией
  app.use(auth);

  app.use('/users', usersRouter);
  app.use('/movies', moviesRouter);
  app.post('/signout', logout);

  // Логер ошибок после роутов и до обработки ошибок
  app.use(errorLogger);

  // Обработчик ошибок celebrate
  app.use(errors());

  // Мидлвар централизованной обработки ошибок
  app.use((
    err: Error | mongoose.Error | MongoServerError,
    req: Request & { user?: string | JwtPayload },
    res: Response,
    next: NextFunction,
  ) => {
    console.log(err);
    let statusCode;
    let message;
    if (err instanceof NotFoundError
     || err instanceof BadRequestError
     || err instanceof UnauthorizedError
     || err instanceof ForbiddenChangesError) {
      ({ statusCode, message } = err);
    } else if (err instanceof mongoose.Error.CastError
      || err instanceof mongoose.Error.ValidationError) {
      statusCode = BadRequestError.DEFAULT_STATUS_CODE;
      message = BadRequestError.DEFAULT_MESSAGE;
    } else if (err.name === 'JsonWebTokenError') {
      statusCode = UnauthorizedError.DEFAULT_STATUS_CODE;
      message = 'Ошибка авторизации';
    } else if (err instanceof MongoServerError && err.code === 11000) {
      statusCode = UniqueFieldConflict.DEFAULT_STATUS_CODE;
      message = UniqueFieldConflict.DEFAULT_MESSAGE;
    } else {
      statusCode = InternalServerError.DEFAULT_STATUS_CODE;
      message = InternalServerError.DEFAULT_MESSAGE;
    }
    res
      .status(statusCode)
      .send({
        message,
      });
    next();
  });

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
};

// перед запуском приложения проверяется соединение с БД
mongoose.connect('mongodb://root:example@localhost:27017/moviesdb?authSource=admin', (err) => {
  if (err) {
    console.error('FAILED TO CONNECT TO MONGODB');
    console.error(err);
  } else {
    console.log('CONNECTED TO MONGODB');
  }
  runApp();
});
