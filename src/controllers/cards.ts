import { NextFunction, Request, Response } from 'express';

import Card from '../models/card';
import { CREATED } from '../constants';
import {
  NotFoundError,
  BadRequestError,
  // UnauthorizedError,
  // ConflictError,
  ForbiddenError,
} from '../errors/index';

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => res.status(CREATED).send({ data: cards }))
  .catch(next);

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = (req as any).user?._id;
  return Card.create({ name, link, owner })
    .then((card) => {
      res.status(CREATED).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const _id = req.params.cardId;
  const idUser = (req as any).user._id;
  return Card.deleteOne({ _id })
    .orFail(new Error('NotValidDeleteCard'))
    .then((data) => {
      if (idUser !== (data as any).owner) {
        throw new ForbiddenError('попытка удалить чужую карточку');
      }
      res.status(CREATED).send({ data });
    })
    .catch((err) => {
      if (err.message === 'NotValidDeleteCard') {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      } else {
        next(err);
      }
    });
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
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
        next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      } else {
        next(err);
      }
    });
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
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
      if (err.name === 'CastError') {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      } else if (err.message === 'NotValidDisLikeCard') {
        next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
      } else {
        next(err);
      }
    });
};
