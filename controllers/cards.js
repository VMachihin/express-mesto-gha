const Card = require('../models/cards');
const { CREATED } = require('../utils/variables');
const { BadRequestErr, NotFoundErr, ForbiddenErr } = require('../errors');

const createCard = (req, res, next) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: _id })
    .then((newCard) => {
      const newCardNoId = newCard.toObject();
      delete newCardNoId._id;
      delete newCardNoId.owner;
      res.status(CREATED).send(newCardNoId);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestErr(
            'Переданы некорректные данные при создании карточки.',
          ),
        );
      }
      next(err);
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove({ cardId })
    .then((card) => {
      if (!card) {
        next(new NotFoundErr('Карточка с id отсутствует в базе'));
      }

      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ForbiddenErr('Введены не корректные данные.'));
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        next(new NotFoundErr('Карточка с указанным id не найдена.'));
      }

      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequestErr(
            'Переданы некорректные данные для постановки лайка.',
          ),
        );
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        next(new NotFoundErr('Карточка с указанным id не найдена.'));
      }

      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequestErr('Переданы некорректные данные для снятия лайка.'),
        );
      }
      next(err);
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
