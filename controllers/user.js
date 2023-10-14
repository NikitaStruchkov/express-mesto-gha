const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');

//  возвращает всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) =>res.status(500).send({ message: err.message }));
};

// возвращает пользователя по _id
module.exports.getUsersById = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
  .orFail(new Error('NotFound'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      else next(err);
    });
};

// создаёт пользователя
module.exports.createUser = (req, res, next) => {
  const { email,
    password,
    name,
    about,
    avatar, } = req.body;
  // хешируем пароль
  bcrypt.hash(password, 10)
  .then(hash => User.create({ email,
    password: hash,
    name,
    about,
    avatar, }))
    .then((user) => res.status(201).send({
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        res.status(409).send({ message: 'Пользователь с такой почтой уже существует' })
        } else  if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' })
      } else next(err);
    });
};
// обновляет профиль
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true
    },
  )
  .orFail(new Error('NotFound'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      else next(err);
    });
};
// обновляет аватар
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true,  runValidators: true })
  .orFail(new Error('NotFound'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      else next(err);
    });
};

// проверяет, есть ли в базе пользователь с указанной почтой;
// если пользователь найден, сверяет хеш его пароля;

module.exports.login = (req, res, next) => {
  const { email } = req.body;

  User.findOne({ email })
  .select('+password')
  .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const token = jwt.sign({ _id: user._id}, 'super-strong-secret', { expiresIn: '7d' } );
      // вернём токен
      res
       .cookie('jwt', token, {
        maxage: 3600000 * 24 * 7,
        httpOnly: true,
      })
      .send({ message: 'Успешная авторизация.' });
    })
    .catch((err) => {
      // ошибка аутентификации
      res
        .status(401)
        .send({ message: err.message });
    });
};


module.exports.currentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
  .orFail(new Error('NotFound'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      else next(err);
    });
  }