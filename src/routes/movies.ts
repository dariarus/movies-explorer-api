import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  unsaveMovie,
  getMovies,
  saveMovie,
} from '../controllers/movies';

import { movieCreateReqValidation, movieUnsaveReqValidation } from '../utils/validation';

const router = Router();

router.get('/', getMovies);

router.post('/', celebrate(movieCreateReqValidation), saveMovie);

router.delete('/:id', celebrate(movieUnsaveReqValidation), unsaveMovie);

export default router;
