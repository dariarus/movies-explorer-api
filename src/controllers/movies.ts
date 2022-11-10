import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import NotFoundError from '../errors/error-404-not-found';

import Movie from '../models/movies';
import ForbiddenChangesError from '../errors/error-403-forbidden';

const NOT_FOUND_MESSAGE = 'Такой фильм не найден';

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
};

// Сохранить фильм к себе (лайкнуть)
export const saveMovie = (
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
    owner: (req.user as JwtPayload)._id,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch(next);
};

// Удалить фильм из понравившихся (дизлайкнуть)
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
        next(new ForbiddenChangesError());
        return;
      }
      movie.remove().then(() => res.send(movie)).catch(next);
    })
    .catch(next);
};
