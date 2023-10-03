const User = require('../models/user');

//  возвращает всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) =>res.status(500).send({ message: err.message }));
};

// возвращает пользователя по _id
module.exports.getUsersById = (req, res) => {
  const userId = req.user._id;
  User.findById(userId);
  orFail(new Error('CastError'))
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: ' Пользователь по указанному _id не найден.' });
      } else res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

// создаёт пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
   orFail(new Error('CastError'))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: ' Пользователь по указанному _id не найден.' });
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
      runValidators: true
    },
  )
  orFail(new Error('CastError'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: ' Пользователь по указанному _id не найден.' });
      } else res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

// обновляет аватар
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true,  runValidators: true })
  orFail(new Error('CastError'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};
