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
cardRouter.post('/cards', auth, validateCreateCard, createCard);
cardRouter.delete('/cards/:cardId', auth, validateCardId, deleteCardById);
cardRouter.put('/cards/:cardId/likes', auth, validateCardId, likeCard);
cardRouter.delete('/cards/:cardId/likes', auth, validateCardId, dislikeCard);

module.exports = cardRouter;
