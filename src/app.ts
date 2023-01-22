import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';

import { databasePath, nodeEnv, port, frontendUrl } from './config';

import generalRouter from './routes';

import { requestLogger, errorLogger } from './middlewares/logger';
import limiter from './middlewares/rate-limiter';
import centralizedErrorsHandler from './middlewares/centralized-errors-handler';

const runApp = () => {
  const app = express();

  console.log(`Starting server with env: ${nodeEnv}`);

  // TODO: добавить ссылку на фронт после его публикации в файл .env.production
  app.use(cors({
    origin: frontendUrl,
    credentials: true,
  }));
  app.use(helmet());
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

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
};

// Перед запуском приложения проверяется соединение с БД
mongoose.connect(`${databasePath}`, (err) => {
  if (err) {
    console.error('FAILED TO CONNECT TO MONGODB');
    console.error(err);
  } else {
    console.log('CONNECTED TO MONGODB');
  }
  runApp();
});
