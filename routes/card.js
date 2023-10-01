const cardRouter = require('express').Router();
const { getCards, createCard, deleteCardById } = require('../controllers/user');

cardRouter.get('/cards', getCards); // возвращает все карточки

cardRouter.delete('/cards/:cardId', deleteCardById); // удаляет карточку по идентификатору

cardRouter.post('/cards', createCard); // создаёт карточку

module.exports = cardRouter;
