const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  createCardValidation,
  cardIdValidation,
} = require('../validation');

cardsRouter.get('/', getCards);
cardsRouter.post(
  '/',
  celebrate({
    body: Joi.object(createCardValidation),
  }),
  createCard,
);
cardsRouter.delete(
  '/:cardId',
  celebrate(cardIdValidation),
  deleteCard,
);
cardsRouter.put(
  '/:cardId/likes',
  celebrate(cardIdValidation),
  likeCard,
);
cardsRouter.delete(
  '/:cardId/likes',
  celebrate(cardIdValidation),
  dislikeCard,
);

module.exports = cardsRouter;
