import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  deleteMovie,
  getMovies,
  saveMovie,
} from '../controllers/movies';

import { movieCreateReqValidation, movieDeleteReqValidation } from '../utils/validation';

const router = Router();

router.get('/', getMovies);

router.post('/', celebrate(movieCreateReqValidation), saveMovie);

router.delete('/:id', celebrate(movieDeleteReqValidation), deleteMovie);

export default router;
