import { Router } from 'express';
import { celebrate } from 'celebrate';

import { createUser, login, logout } from '../controllers/auth';

import auth from '../middlewares/auth';

import usersRouter from './users';
import moviesRouter from './movies';

import NotFoundError from '../errors/error-404-not-found';

import { signinReqValidation, signupReqValidation } from '../utils/validation';
import { NOT_FOUND_PAGE_MESSAGE } from '../utils/request-messanges';

const generalRouter = Router();

generalRouter.post('/signup', celebrate(signupReqValidation), createUser);

generalRouter.post('/signin', celebrate(signinReqValidation), login);

// Защита роутов авторизацией
generalRouter.use(auth);

generalRouter.use('/users', usersRouter);
generalRouter.use('/movies', moviesRouter);
generalRouter.post('/signout', logout);

// Обработка несуществующего роута
generalRouter.all('*', () => {
  throw new NotFoundError(NOT_FOUND_PAGE_MESSAGE);
});

export default generalRouter;
