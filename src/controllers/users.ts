import { Request, Response } from 'express';

import User from '../models/user';

export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.status(201).send({ data: users }))
  .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));

export const getUserById = (req: Request, res: Response) => {
  const id = req.params.userId;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(201).send({ data: user });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.create({
    name,
    about,
    avatar,
  })
    .then((user) => {
      if (!user) {
        return res.status(400).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      }
      return res.status(201).send({ data: user });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};

export const updateUser = (req: Request, res: Response) => {
  const id = (req as any).user._id;
  const { name, about } = req.body;
  return User.findByIdAndUpdate(id, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(201).send({ data: user });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};

export const updateAvatar = (req: Request, res: Response) => {
  const id = (req as any).user._id;
  const { avatar } = req.body;
  return User.findByIdAndUpdate(id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(201).send({ data: user });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};
