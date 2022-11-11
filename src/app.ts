import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';

import generalRouter from './routes';

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

  // Подключение роутов
  app.use('/', generalRouter);

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
