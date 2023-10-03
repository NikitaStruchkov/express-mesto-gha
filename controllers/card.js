const Card = require('../models/card');

//  возвращает все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(404).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

// создаёт карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  console.log(req.user._id); // _id станет доступен

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(404).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

//  удаляет карточку по идентификатору
module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'Bad Request') {
        res.status(400).send({ message: ' Карточка с указанным _id не найдена.' });
      }
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
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'Bad Request') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
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
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      } else res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};
