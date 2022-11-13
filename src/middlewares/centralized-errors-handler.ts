import mongoose from 'mongoose';
import { MongoServerError } from 'mongodb';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import NotFoundError from '../errors/error-404-not-found';
import BadRequestError from '../errors/error-400-bad-request';
import UnauthorizedError from '../errors/error-401-unauthorized';
import ForbiddenChangesError from '../errors/error-403-forbidden';
import UniqueFieldConflict from '../errors/error-409-conflict';
import InternalServerError from '../errors/error-500-internal-server-error';

function centralizedErrorsHandler(
  err: Error | mongoose.Error | MongoServerError,
  req: Request & { user?: string | JwtPayload },
  res: Response,
  next: NextFunction,
) {
  console.log(err);
  let statusCode;
  let message;
  if (err instanceof NotFoundError
    || err instanceof BadRequestError
    || err instanceof UnauthorizedError
    || err instanceof ForbiddenChangesError) {
    console.log('зашли');
    ({ statusCode, message } = err);
  } else if (err instanceof mongoose.Error.CastError
    || err instanceof mongoose.Error.ValidationError) {
    statusCode = BadRequestError.DEFAULT_STATUS_CODE;
    message = BadRequestError.DEFAULT_MESSAGE;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = UnauthorizedError.DEFAULT_STATUS_CODE;
    message = 'Ошибка авторизации';
  } else if (err instanceof UniqueFieldConflict
    || (err instanceof MongoServerError
      && err.code === 11000)) {
    statusCode = UniqueFieldConflict.DEFAULT_STATUS_CODE;
    message = UniqueFieldConflict.DEFAULT_MESSAGE;
  } else {
    statusCode = InternalServerError.DEFAULT_STATUS_CODE;
    message = InternalServerError.DEFAULT_MESSAGE;
  }
  res
    .status(statusCode)
    .send({
      message,
    });
  next();
}

export default centralizedErrorsHandler;
