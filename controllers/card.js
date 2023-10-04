const Card = require('../models/card');

//  возвращает все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) =>res.status(500).send({ message: err.message }));
};

// создаёт карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  console.log(req.user._id); // _id станет доступен

  Card.create({ name, link, owner: req.user._id })
  orFail(new Error('Переданы некорректные данные при создании карточки.'))
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: '' });
      } else res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

//  удаляет карточку по идентификатору
module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
  orFail(new Error('Карточка с указанным _id не найдена.'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'Карточка с указанным _id не найдена.') {
        res.status(404).send({ message: '' });
      } else res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

// поставить лайк карточке
module.exports.likeCard = (req, res) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: userId } }, // добавить _id в массив, если его там нет
    { new: true },
  )
  orFail(new Error('Переданы некорректные данные для постановки/снятии лайка'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'Переданы некорректные данные для постановки/снятии лайка') {
        res.status(400)
      } else res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

// убрать лайк с карточки
module.exports.dislikeCard = (req, res) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: userId } }, // убрать _id из массива
    { new: true },
    orFail(new Error('Передан несуществующий _id карточки.'))
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'Передан несуществующий _id карточки.') {
        res.status(400)
      } else res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};
