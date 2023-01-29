import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/users';

import UnauthorizedError from '../errors/error-401-unauthorized';
import UniqueFieldConflict from '../errors/error-409-conflict';

import { LOGOUT_SUCCESS } from '../utils/request-messanges';

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
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? `${JWT_SECRET}` : 'dev-secret',
        { expiresIn: '10d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24,
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        })
        .status(201)
        .send({
          email: user.email,
          name: user.name,
          token,
        });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new UniqueFieldConflict());
      } else {
        next(err);
      }
    });
};

// Войти в аккаунт (авторизация)
export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError());
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
              sameSite: 'none',
              secure: true,
            });
          res.send({ token });
        }).catch(next);
    }).catch(next);
};

export const logout = (req: Request, res: Response) => {
  res
    .clearCookie('jwt', { maxAge: -1 })
    .send(LOGOUT_SUCCESS);
};
