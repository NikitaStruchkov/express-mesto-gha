const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');

//  возвращает все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

// создаёт карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  console.log(req.user._id); // _id станет доступен

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next (new BadRequestError('Переданы некорректные данные при создании карточки.'));
      } else next(err);
    });
};

//  удаляет карточку по идентификатору
module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
  .orFail(() => NotFoundError('Карточка с указанным _id не найдена.'))
  .then((card) => {
    if (JSON.stringify(card.owner) !== JSON.stringify(req.user.payload)) {
      return next (new UnauthorizedError('Невозможно удалить чужую карточку'));
    }
    return card.deleteOne()
      .then(() => res.send({ message: 'Карточка удалена.' }));
  })
    .catch((err) => {
      if (err instanceof NotFoundError) {
      return   res.status(err.statusCode).send({ message: err.message });
      }
      else if (err.name === 'CastError') {
      return  next (new BadRequestError('Переданы некорректные данные карточки'));
      }
      else {
        return next(err);
      }
    });
};

// поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: userId } }, // добавить _id в массив, если его там нет
    { new: true },
  )
  .orFail(new NotFoundError('Передан несуществующий _id карточки.'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      else if (err.name === 'CastError') {
        return next (new BadRequestError('Переданы некорректные данные для постановки/снятии лайка.'));
      }
      else {
        return next(err);
      }
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
  .orFail(() => NotFoundError('Передан несуществующий _id карточки.'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof NotFoundError) {
       return  res.status(err.statusCode).send({ message: err.message });
      }
      else if (err.name === 'CastError') {
        return next (new BadRequestError('Переданы некорректные данные для постановки/снятии лайка.'));
      }
      else {
        return next(err);
      }
    });
};
