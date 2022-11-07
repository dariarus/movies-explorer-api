import {Request, Response, NextFunction} from 'express';
import {JwtPayload} from 'jsonwebtoken';
import mongoose from 'mongoose';
import NotFoundError from '../errors/error-404-not-found';

import Movie from '../models/movies';
import UnauthorizedError from '../errors/error-403';

const NOT_FOUND_MESSAGE = 'Такой фильм не найден';
const UNAUTHORIZED_MESSAGE = 'Авторизируйтесь, чтобы удалять сохраненные фильмы';

// Вернуть сохраненные пользователем фильмы
export const getMovies = (
  req: Request & { user?: JwtPayload | string },
  res: Response,
  next: NextFunction,
) => {
  Movie.find({ owner: (req.user as JwtPayload)._id })
    .then((movies) => {
      if (!movies) {
        res.send([]);
      }
      res.send(movies);
    })
    .catch(next);
}

// Создать новый фильм
export const createMovie = (
  req: Request & { user?: JwtPayload | string },
  res: Response,
  next: NextFunction,
) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
   // owner: (req.user as JwtPayload)._id,
    owner: "1"
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch(next);
};

export const unsaveMovie = (
  req: Request & { user?: JwtPayload | string },
  res: Response,
  next: NextFunction,
) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError(NOT_FOUND_MESSAGE));
        return;
      }
      if (String(movie.owner) !== (req.user as JwtPayload)._id) {
        next(new UnauthorizedError(UNAUTHORIZED_MESSAGE));
        return;
      }
      movie.remove().then(() => res.send(movie)).catch(next);
    })
    .catch(next);
};
