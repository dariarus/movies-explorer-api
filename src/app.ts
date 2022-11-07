import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import { JwtPayload } from 'jsonwebtoken';

import auth from './middlewares/auth';

import usersRouter from './routes/users';
import moviesRouter from './routes/movies';

import { MongoServerError } from 'mongodb';
import NotFoundError from './errors/error-404-not-found';
import BadRequestError from './errors/error-400';
import UnauthorizedError from './errors/error-401-unauthorized';
//import UserRightsError from './errors/error-403';
import UniqueFieldConflict from './errors/error-409';

const { PORT = 3000 } = process.env;

const runApp = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Защита роутов авторизацией
  app.use(auth);

  app.use('/users', usersRouter);
  app.use('/movies', moviesRouter);

  // обработчик ошибок celebrate
  app.use(errors());

  app.use((
    err: Error | mongoose.Error | MongoServerError,
    req: Request & { user?: string | JwtPayload },
    res: Response,
    next: NextFunction,
  ) => {
    console.log(err);
    let statusCode;
    let message;
    if (err instanceof NotFoundError) {
     // || err instanceof BadRequestError
     // || err instanceof IncorrectCredentialsError
     // || err instanceof UserRightsError) {
      ({ statusCode, message } = err);
    } else if (err instanceof mongoose.Error.CastError
      || err instanceof mongoose.Error.ValidationError) {
      statusCode = BadRequestError.DEFAULT_STATUS_CODE;
      message = BadRequestError.DEFAULT_MESSAGE;
    }
    else if (err.name === 'JsonWebTokenError') {
      statusCode = UnauthorizedError.DEFAULT_STATUS_CODE;
      message = 'Ошибка авторизации';
    } else if (err instanceof MongoServerError && err.code === 11000) {
      statusCode = UniqueFieldConflict.DEFAULT_STATUS_CODE;
      message = UniqueFieldConflict.DEFAULT_MESSAGE;
    } else {
      statusCode = 500;
      message = 'На сервере произошла ошибка';
    }

    res
      .status(statusCode)
      .send({
        message,
      });

    next();
  });

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
  })
}

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


