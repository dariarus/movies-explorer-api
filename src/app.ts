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

import { requestLogger, errorLogger } from './middlewares/logger';
import limiter from './middlewares/rate-limiter';
import centralizedErrorsHandler from './middlewares/centralized-errors-handler';

require('dotenv').config();

const { PORT = 3000 } = process.env;

const runApp = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Ограничение количества запросов во временном промежутке
  app.use(limiter);

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
  app.use(centralizedErrorsHandler);

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
};

// Перед запуском приложения проверяется соединение с БД
mongoose.connect('mongodb://root:example@localhost:27017/moviesdb?authSource=admin', (err) => {
  if (err) {
    console.error('FAILED TO CONNECT TO MONGODB');
    console.error(err);
  } else {
    console.log('CONNECTED TO MONGODB');
  }
  runApp();
});
