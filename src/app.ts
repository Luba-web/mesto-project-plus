import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import usersRouter from './routers/users';
import cardsRouter from './routers/cards';
import { requestLogger, errorLogger } from './middlewares/logger';
import { validateRegisterUser, validateLogin } from './middlewares/validation';

interface Error {
  statusCode: number,
  message: string,
}

// Слушаем 3000 порт
const { PORT = 3000, BASE_PATH = 'none' } = process.env;

const app = express();
app.use(express.json());
// подключаемся к серверу MongoiDB
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger); // подключаем логер запросов

app.post('/signup', validateRegisterUser, createUser);
app.post('/signin', validateLogin, login);

app.use(auth);// все роуты ниже этой строки будут защищены

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(errorLogger); // подключаем логер ошибок

app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Ошибка по умолчанию' : message,
  });
});

app.listen(PORT, () => {
  console.log('Ссылка на сервер');// eslint-disable-line
  console.log(BASE_PATH);// eslint-disable-line
});
