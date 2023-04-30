const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardsRouter.get('/', getCards);
cardsRouter.post(
  '/',
  celebrate({
    body: Joi.object({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string()
        .required()
        .regex(/^(http|https):\/\/[^ "]+$/),
    }),
  }),
  createCard
);
cardsRouter.delete(
  '/:cardId',
  celebrate({
    params: Joi.object({
      cardId: Joi.string(),
    }),
  }),
  deleteCard
);
cardsRouter.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object({
      cardId: Joi.string(),
    }),
  }),
  likeCard
);
cardsRouter.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object({
      cardId: Joi.string(),
    }),
  }),
  dislikeCard
);

module.exports = cardsRouter;
