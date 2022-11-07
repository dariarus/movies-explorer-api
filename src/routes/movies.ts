import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import {createMovie, unsaveMovie, getMovies} from '../controllers/movies';
import {
  NAME_EN_REGEX,
  NAME_RU_REGEX,
  validateId, validateURL,
} from '../utils/constants';

const router = Router();

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validateURL, 'custom URL validation'),
    trailerLink: Joi.string().required().custom(validateURL, 'custom URL validation'),
    thumbnail: Joi.string().required().custom(validateURL, 'custom URL validation'),
    //movieId: Joi.string().custom(validateId, 'custom id validation').required(),
    movieId: Joi.string().required(),
    nameRU: Joi.string().regex(NAME_RU_REGEX).required(),
    nameEN: Joi.string().regex(NAME_EN_REGEX).required(),
  }),
}), createMovie);

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().custom(validateId, 'custom id validation'),
  }),
}), unsaveMovie);

export default router;