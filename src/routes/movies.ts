import { Router } from 'express';
import { celebrate, Joi, SchemaOptions } from 'celebrate';

import {
  unsaveMovie,
  getMovies,
  saveMovie,
} from '../controllers/movies';
import { validateId } from '../utils/constants';

import { movieCreateReqValidation } from '../utils/validation';

const router = Router();

router.get('/', getMovies);

router.post('/', celebrate(movieCreateReqValidation), saveMovie);

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().custom(validateId, 'custom id validation.ts'),
  }),
}), unsaveMovie);

export default router;
