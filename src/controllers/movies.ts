import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import NotFoundError from '../errors/error-404-not-found';

import Movie from '../models/movies';
// import ForbiddenChangesError from '../errors/error-403-forbidden';

import { NOT_FOUND_MOVIE_MESSAGE } from '../utils/request-messanges';

// Вернуть сохраненные пользователем фильмы
export const getMovies = (
  req: Request & { user?: JwtPayload | string },
  res: Response,
  next: NextFunction,
) => {
  Movie.find({ owner: (req.user as JwtPayload)._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

// Сохранить фильм к себе (лайкнуть)
export const saveMovie = (
  req: Request & { user?: JwtPayload | string },
  res: Response,
  next: NextFunction,
) => Movie.create({ ...req.body, owner: (req.user as JwtPayload)._id })
  .then((movie) => {
    res.send(movie);
  })
  .catch((err) => {
    next(err);
  });

// Удалить фильм из понравившихся (дизлайкнуть)
export const deleteMovie = (
  req: Request & { user?: JwtPayload | string },
  res: Response,
  next: NextFunction,
) => {
  Movie.find({ id: req.params.id, owner: (req.user as JwtPayload)._id })
    .then((movies) => {
      if (!movies || movies.length === 0) {
        next(new NotFoundError(NOT_FOUND_MOVIE_MESSAGE));
        return;
      }
      // if (String(movie.owner) !== (req.user as JwtPayload)._id) {
      //   next(new ForbiddenChangesError());
      //   return;
      // }
      Movie.deleteMany({ id: { $in: movies.map((movie) => movie.id) } })
        .then(() => res.send(movies)).catch(next);
    })
    .catch(next);
};
