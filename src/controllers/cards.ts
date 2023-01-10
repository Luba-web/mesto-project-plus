import { Request, Response } from 'express';

import Card from '../models/card';
import {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  BAD_REQUEST,
  CREATED,
} from '../constants/constants';

export const getCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => res.status(CREATED).send({ data: cards }))
  .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' }));

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  const owner = (req as any).user?._id;
  return Card.create({ name, link, owner })
    .then((card) => {
      res.status(CREATED).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка по умолчанию' });
      }
    });
};

export const deleteCard = (req: Request, res: Response) => {
  const _id = req.params.cardId;
  return Card.deleteOne({ _id })
    .orFail(new Error('NotValidDeleteCard'))
    .then((data) => res.status(CREATED).send({ data }))
    .catch((err) => {
      if (err.message === 'NotValidDeleteCard') {
        res
          .status(NOT_FOUND)
          .send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка по умолчанию' });
      }
    });
};

export const likeCard = (req: Request, res: Response) => {
  // $addToSet, чтобы добавить элемент в массив, если его там ещё нет;
  const id = req.params.cardId;
  return Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: (req as any).user._id } }, // добавить _id в массив, если его там нет
    { new: true, runValidators: true },
  )
    .orFail(new Error('NotValidLikeCard'))
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err.message === 'NotValidLikeCard') {
        res
          .status(BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные для постановки лайка',
          });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка по умолчанию' });
      }
    });
};

export const dislikeCard = (req: Request, res: Response) => {
  // $pull, чтобы убрать.
  const id = req.params.cardId;
  return Card.findByIdAndUpdate(
    id,
    { $pull: { likes: (req as any).user._id } }, // убрать _id из массива
    { new: true, runValidators: true },
  )
    .orFail(new Error('NotValidDisLikeCard'))
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err.message === 'NotValidDisLikeCard') {
        res
          .status(BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные для снятия лайка',
          });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка по умолчанию' });
      }
    });
};
