const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { urlValidate } = require('../utils/variables');

cardsRouter.get('/', getCards);
cardsRouter.post(
  '/',
  celebrate({
    body: Joi.object({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string()
        .required()
        .regex(urlValidate),
    }),
  }),
  createCard,
);
cardsRouter.delete(
  '/:cardId',
  celebrate({
    params: Joi.object({
      cardId: Joi.string().hex(),
    }),
  }),
  deleteCard,
);
cardsRouter.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object({
      cardId: Joi.string().hex(),
    }),
  }),
  likeCard,
);
cardsRouter.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object({
      cardId: Joi.string().hex(),
    }),
  }),
  dislikeCard,
);

module.exports = cardsRouter;
