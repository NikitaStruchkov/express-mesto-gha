const User = require('../models/user');

//  возвращает всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.name === 'Bad Request') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

// возвращает пользователя по _id
module.exports.getUsersById = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(404).send({ message: ' Пользователь по указанному _id не найден.' });
      } else res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

// создаёт пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(404).send({ message: ' Пользователь по указанному _id не найден.' });
      } else res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};
// обновляет профиль
module.exports.updateUser = (req, res) => {
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
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(404).send({ message: ' Пользователь по указанному _id не найден.' });
      } if (err.name === 'Bad Request') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

// обновляет аватар
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(404).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } if (err.name === 'Bad Request') {
        res.status(400).send({ message: 'Пользователь с указанным _id не найден.' });
      } else res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};
