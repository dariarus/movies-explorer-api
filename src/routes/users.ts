import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { getUser, updateUser } from '../controllers/users';

const router = Router();

router.get('/me', getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
}), updateUser);

export default router;
