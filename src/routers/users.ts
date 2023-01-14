import { Router as expressRouter } from 'express';

import {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getInfoUser,
} from '../controllers/users';
import {
  validateFindId,
  validateUpdateUser,
  validateUpdateAvatar,
} from '../middlewares/validation';

const router = expressRouter();

router.get('/', getUsers);
router.get('/:userId', validateFindId, getUserById);
router.get('/me', getInfoUser);
router.patch('/me', validateUpdateUser, updateUser);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

export default router;
