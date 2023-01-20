import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import UnauthorizedError from '../errors/error-401-unauthorized';

import { AUTHORIZATION_ERROR } from '../utils/request-messanges';
import { jwtSecret } from '../config';

function auth(req: Request & { user?: JwtPayload | string }, res: Response, next: NextFunction) {
  const token = req.cookies.jwt;
  console.log('req: ');
  console.log(req.headers);

  if (!token) {
    next(new UnauthorizedError(AUTHORIZATION_ERROR));
    return;
  }
  let payload;

  try {
    payload = jwt.verify(token, `${jwtSecret}`);
  } catch (err) {
    next(err);
    return;
  }
  req.user = payload;

  next();
}

export default auth;
