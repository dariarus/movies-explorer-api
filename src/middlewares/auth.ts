import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UnauthorizedError from '../errors/error-401-unauthorized';

const { NODE_ENV, JWT_SECRET } = process.env;

const INCORRECT_TOKEN_MESSAGE = 'Ошибка авторизации';

function auth(req: Request & { user?: JwtPayload | string }, res: Response, next: NextFunction) {
  const token = req.cookies.jwt;

  if (!token) {
    next(new UnauthorizedError(INCORRECT_TOKEN_MESSAGE));
    return;
  }
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? `${JWT_SECRET}` : 'dev-secret');
  } catch (err) {
    next(err);
    return;
  }
  req.user = payload;

  next();
}

export default auth;
