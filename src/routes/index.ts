import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { createUser, login, logout } from '../controllers/auth';

import auth from '../middlewares/auth';

import usersRouter from './users';
import moviesRouter from './movies';

const generalRouter = Router();

generalRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

generalRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
}), login);

// Защита роутов авторизацией
generalRouter.use(auth);

generalRouter.use('/users', usersRouter);
generalRouter.use('/movies', moviesRouter);
generalRouter.post('/signout', logout);

export default generalRouter;
