import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { PORT, DBMESTO_URL, NOT_FOUND } from './constants';
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
// Для защиты от DoS-атак
const limiter = rateLimit({
  windowMs: 16 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();
app.use(limiter);
// helmet для простановки security-заголовков для защиты
app.use(helmet());

app.use(express.json());
// подключаемся к серверу MongoiDB
mongoose.connect(DBMESTO_URL);

app.use(requestLogger); // подключаем логер запросов

app.post('/signup', validateRegisterUser, createUser);
app.post('/signin', validateLogin, login);

app.use(auth);// все роуты ниже этой строки будут защищены

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Не найден ресурс' });
});

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
  console.log('Подключились на сервер');// eslint-disable-line
});
