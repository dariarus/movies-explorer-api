import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import User from '../models/users';
import NotFoundError from '../errors/error-404-not-found';

const NOT_FOUND_MESSAGE = 'Такой пользователь не существует';

// Вернуть авторизованного пользователя
export const getUser = (req: Request & { user?: JwtPayload | string }, res: Response, next: NextFunction) => {
  User.findById(req.user)
    .then((user) => {
      if (!user) {
        next(new NotFoundError(NOT_FOUND_MESSAGE));
        return;
      }
      res.send(user);
    })
    .catch(next);
};

// Обновить информацию о пользователе
export const updateUser = (
  req: Request & { user?: JwtPayload | string },
  res: Response,
  next: NextFunction,
) => {
  const { name, email } = req.body;

  return User.findByIdAndUpdate(
    (req.user as JwtPayload)._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(NOT_FOUND_MESSAGE);
      }
      res.send(user);
    })
    .catch(next);
};