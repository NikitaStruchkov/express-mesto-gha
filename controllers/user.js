const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');
const JWT_KEY = '3b2c0b48afb683532c72b31d8538ccdac9398a91ea91b290e0a90599393c65aa';

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
// const UnauthorizedError = require('../errors/UnauthorizedError');

//  возвращает всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

// возвращает пользователя по _id
module.exports.getUsersById = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден.'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return res.status(err.statusCode).send({ message: err.message });
      } else if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      } else {
        return next(err);
      }
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
   return next (new ConflictError ('Пользователь с такой почтой уже существует'));
        } else  if (err.name === 'ValidationError') {
       return next (new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      } else {
        return next(err);
      }
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
  .orFail(new NotFoundError('Пользователь по указанному _id не найден.'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      else if (err.name === 'ValidationError') {
       return  next (new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      }
      else {
        return next(err);
      }
    });
};
// обновляет аватар
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true,  runValidators: true })
  .orFail(new NotFoundError('Пользователь по указанному _id не найден.'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      else if (err.name === 'ValidationError') {
        return next (new BadRequestError('Переданы некорректные данные при обновлении аватара.' ));
      }
      else {
        return next(err);
      }
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
      const token = jwt.sign({ _id: user._id}, JWT_KEY, { expiresIn: '7d' } );
      // вернём токен
      res
       .cookie('jwt', token, {
        maxage: 3600000 * 24 * 7,
        httpOnly: true,
      })
      .send({ message: 'Успешная авторизация.' });
    })
    .catch(next);
};


module.exports.currentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
  .orFail(new NotFoundError('Пользователь по указанному _id не найден.'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof NotFoundError) {
       return  res.status(err.statusCode).send({ message: err.message });
      }

      else {
        return next(err);
      }
    });
  }