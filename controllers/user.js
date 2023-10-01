const User = require('../models/user');

//  возвращает всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

// возвращает пользователя по _id
module.exports.getUsersById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

// создаёт пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
