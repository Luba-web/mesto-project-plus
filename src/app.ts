import express, { Request, Response, NextFunction } from 'express';

import mongoose from 'mongoose';

import usersRouter from './routers/users';
import cardsRouter from './routers/cards';

// Слушаем 3000 порт
const { PORT = 3000, BASE_PATH = 'none' } = process.env;

const app = express();
app.use(express.json());
// подключаемся к серверу MongoiDB
mongoose.connect('mongodb://localhost:27017/mestodb');

// харкорд _id (req as any) иначе ругается ts
app.use((req: Request, res: Response, next: NextFunction) => {
  (req as any).user = {
    _id: '63b4a040cc0401c12c280852', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(BASE_PATH);
});
