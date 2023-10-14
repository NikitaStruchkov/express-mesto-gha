const cardRouter = require('express').Router();
const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/card');
const auth = require('../middlewares/auth');
const {
  validateCreateCard,
  validateCardId,
} = require('../middlewares/validate');

cardRouter.get('/cards', auth, getCards);
cardRouter.post('/cards',validateCreateCard, auth, createCard);
cardRouter.delete('/cards/:cardId',validateCardId, auth, deleteCardById);
cardRouter.put('/cards/:cardId/likes',validateCardId, auth, likeCard);
cardRouter.delete('/cards/:cardId/likes',validateCardId, auth, dislikeCard);

module.exports = cardRouter;
