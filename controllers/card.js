const Card = require('../models/card');

//  возвращает все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) =>res.status(500).send({ message: err.message }));
};

// создаёт карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  console.log(req.user._id); // _id станет доступен

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else next(err);
    });
};

//  удаляет карточку по идентификатору
module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
  .orFail(() => Error("NotFound"))
  .then((card) => {
    if (JSON.stringify(card.owner) !== JSON.stringify(req.user.payload)) {
      return res.status(401).send({ message: 'Невозможно удалить чужую карточку' });
    }
    return card.deleteOne()
      .then(() => res.send({ message: 'Карточка удалена.' }));
  })
    .catch((err) => {
      if (err instanceof Error && err.message === "NotFound") {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные карточки' });
      }
      else next(err);
    });
};


module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => new ErrorNotFound('Карточка не найдена.'))
    .then((card) => {
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user.payload)) {
        return next(new ErrorForbidden('Нельзя удалять чужие карточки.'));
      }
      return card.deleteOne()
        .then(() => res.send({ message: 'Карточка удалена.' }));
    })
    .catch(next);
};




// поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: userId } }, // добавить _id в массив, если его там нет
    { new: true },
  )
  .orFail(new Error('NotFound'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      }
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка. ' });
      }
      else next(err);
    });
};


// убрать лайк с карточки
module.exports.dislikeCard = (req, res, next) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: userId } }, // убрать _id из массива
    { new: true }
  )
  .orFail(() => Error("NotFound"))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof Error && err.message === "NotFound") {
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      }
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка. ' });
      }
      else next(err);
    });
};
