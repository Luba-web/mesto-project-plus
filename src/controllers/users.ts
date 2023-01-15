import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { CREATED } from '../constants';
import {
  NotFoundError,
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} from '../errors/index';

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.status(CREATED).send({ data: users }))
  .catch(next);

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.userId;
  return User.findById(id)
    .orFail(new Error('NotValidGetUserById'))
    .then((user) => res.status(CREATED).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotValidGetUserById') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => {
          res.status(CREATED).send({
            _id: user._id,
            email: user.email,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError('при регистрации указаный email, уже существует на сервере'));
          } else if (err.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => next(err));
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
    .orFail(new Error('NotValidLogin'))
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
          return res.status(CREATED).send({
            token: jwt.sign({ _id: user?._id }, 'super-strong-secret', { expiresIn: '7d' }),
          });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      if (err.message === 'NotValidLogin') {
        next(new BadRequestError('Неправильный логин или пароль'));
      } else {
        next(err);
      }
    });
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const id = (req as any).user._id;
  const { name, about } = req.body;
  return User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotValidUpdateUser'))
    .then((user) => res.status(CREATED).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotValidUpdateUser') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const id = (req as any).user._id;
  const { avatar } = req.body;
  return User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotValidUpdateAvatar'))
    .then((user) => res.status(CREATED).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotValidUpdateAvatar') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      } else {
        next(err);
      }
    });
};

export const getInfoUser = (req: Request, res: Response, next: NextFunction) => {
  const id = (req as any).user._id;
  return User.findById(id)
    .orFail(new Error('NotValidGetInfoUser'))
    .then((user) => res.status(CREATED).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotValidGetInfoUser') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
