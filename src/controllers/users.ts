import { Request, Response } from 'express';

import User from '../models/user';
import {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  NOT_FOUND,
  CREATED,
} from '../constants/constants';

export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.status(CREATED).send({ data: users }))
  .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' }));

export const getUserById = (req: Request, res: Response) => {
  const id = req.params.userId;
  return User.findById(id)
    .orFail(new Error('NotValidGetUserById'))
    .then((user) => res.status(CREATED).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotValidGetUserById') {
        res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден' });
      } else if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка по умолчанию' });
      }
    });
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.create({
    name,
    about,
    avatar,
  })
    .then((user) => res.status(CREATED).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка по умолчанию' });
      }
    });
};

export const updateUser = (req: Request, res: Response) => {
  const id = (req as any).user._id;
  const { name, about } = req.body;
  return User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotValidUpdateUser'))
    .then((user) => res.status(CREATED).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotValidUpdateUser') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка по умолчанию' });
      }
    });
};

export const updateAvatar = (req: Request, res: Response) => {
  const id = (req as any).user._id;
  const { avatar } = req.body;
  return User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotValidUpdateAvatar'))
    .then((user) => res.status(CREATED).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotValidUpdateAvatar') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка по умолчанию' });
      }
    });
};
