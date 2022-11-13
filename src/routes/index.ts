import {NextFunction, Router} from 'express';
import { celebrate, Joi } from 'celebrate';

import { createUser, login, logout } from '../controllers/auth';

import auth from '../middlewares/auth';

import usersRouter from './users';
import moviesRouter from './movies';
import NotFoundError from '../errors/error-404-not-found';

const generalRouter = Router();

const NOT_FOUND_MESSAGE = 'Страница не найдена';

generalRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

generalRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

// Защита роутов авторизацией
generalRouter.use(auth);

generalRouter.use('/users', usersRouter);
generalRouter.use('/movies', moviesRouter);
generalRouter.post('/signout', logout);

// Обработка несуществующего роута
generalRouter.all('*', () => {
  throw new NotFoundError(NOT_FOUND_MESSAGE);
});

export default generalRouter;
