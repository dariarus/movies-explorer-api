import mongoose from 'mongoose';
import { MongoServerError } from 'mongodb';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { isCelebrateError } from 'celebrate';

import NotFoundError from '../errors/error-404-not-found';
import BadRequestError from '../errors/error-400-bad-request';
import UnauthorizedError from '../errors/error-401-unauthorized';
import ForbiddenChangesError from '../errors/error-403-forbidden';
import UniqueFieldConflict from '../errors/error-409-conflict';
import InternalServerError from '../errors/error-500-internal-server-error';

import { AUTHORIZATION_ERROR } from '../utils/request-messanges';

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
    ({ statusCode, message } = err);
  } else if (err instanceof mongoose.Error.CastError
    || err instanceof mongoose.Error.ValidationError) {
    statusCode = BadRequestError.DEFAULT_STATUS_CODE;
    message = BadRequestError.DEFAULT_MESSAGE;
  } else if (isCelebrateError(err)) {
    let validationMessage = '';
    err.details.forEach((value) => {
      validationMessage += `${value} `;
    });
    statusCode = BadRequestError.DEFAULT_STATUS_CODE;
    message = validationMessage;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = UnauthorizedError.DEFAULT_STATUS_CODE;
    message = AUTHORIZATION_ERROR;
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
