import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';

import generalRouter from './routes';

import { requestLogger, errorLogger } from './middlewares/logger';
import limiter from './middlewares/rate-limiter';
import centralizedErrorsHandler from './middlewares/centralized-errors-handler';

console.log(process.env.NODE_ENV);

let envPath;
if (process.env.NODE_ENV) {
  envPath = `./.env.${process.env.NODE_ENV}`;
} else {
  envPath = './.env';
}

require('dotenv').config({ path: envPath });

const { NODE_ENV, DATABASE_PATH, PORT = 3000 } = process.env;

const runApp = () => {
  const app = express();

  console.log(`Starting server with env: ${NODE_ENV}`);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Логер запросов до всех роутов и лимитера
  app.use(requestLogger);

  // Ограничение количества запросов во временном промежутке
  app.use(limiter);

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
mongoose.connect(`${DATABASE_PATH}`, (err) => {
  if (err) {
    console.error('FAILED TO CONNECT TO MONGODB');
    console.error(err);
  } else {
    console.log('CONNECTED TO MONGODB');
  }
  runApp();
});
