import { Router } from 'express';
import { celebrate } from 'celebrate';

import { getUser, updateUser } from '../controllers/users';
import { userChangeReqValidation } from '../utils/validation';

const router = Router();

router.get('/me', getUser);

router.patch('/me', celebrate(userChangeReqValidation), updateUser);

export default router;
