const express = import('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');
const helmet = require('helmet');
const { login, createUser } = require('./controllers/user');
const { errors } = require('celebrate');
const { validateCreateUser, validateLogin } = require('./middlewares/validate');
const NotFoundError = require('./errors/NotFoundError');

// Слушаем 3000 порт
const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1/mestodb' } = process.env;

const app = express();
app.get('/', (req, res) => {
  res.send('test');
});

// подключаемся к серверу mongo
mongoose.connect(MONGO_URL);
app.use(helmet());
app.use(express.json());

// роуты
app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);


app.use(userRouter);
app.use(cardRouter);

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use((req, res, next) => next(new NotFoundError('Такой страницы не существует')));

// централизованная обработка ошибок
app.use((err, req, res) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
