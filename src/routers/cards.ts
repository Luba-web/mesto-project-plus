import { Router as expressRouter } from 'express';
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import { validateCreateCard, validateFindId } from '../middlewares/validation';

const router = expressRouter();

router.get('/', getCards);
router.post('/', validateCreateCard, createCard);
router.delete('/:cardId', validateFindId, deleteCard);
router.put('/:cardId/likes', validateFindId, likeCard);
router.delete('/:cardId/likes', validateFindId, dislikeCard);

export default router;
