const Card = require('../models/card');

//  возвращает все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

// создаёт карточку
module.exports.createCard = (req, res) => {
  const {
    name, link,
  } = req.body;
  console.log(req.user._id); // _id станет доступен

  Card.create({
    name, link,
  })
    .then((card) => res.send(card))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

//  удаляет карточку по идентификатору
module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.send(card))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
