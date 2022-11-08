import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/users';

import NotFoundError from '../errors/error-404-not-found';
import UnauthorizedError from '../errors/error-401-unauthorized';

const { NODE_ENV, JWT_SECRET } = process.env;

// Создать нового юзера (регистрация)
export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      res
        .send({
          email: user.email,
          name: user.name,
        })
        .redirect('/signin');
    })
    .catch(next);
};

// Войти в аккаунт (авторизация)
export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
        return;
      }

      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new UnauthorizedError());
            return;
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? `${JWT_SECRET}` : 'dev-secret',
            { expiresIn: '10d' },
          );
          // сохранение токена в cookie
          res
            .cookie('jwt', token, {
              maxAge: 3600000 * 24, // токен действителен 24 часа
              httpOnly: true,
              sameSite: true,
            });
          res.send({ token });
        }).catch(next);
    }).catch(next);
};

export const logout = (req: Request, res: Response) => {
  res
    .clearCookie('jwt')
    .send('Успешный выход из аккаунта')
    .redirect('/signin');
};
