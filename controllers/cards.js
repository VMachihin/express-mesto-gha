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

      res.status(CREATED).send(newCardNoId);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestErr(
            'Переданы некорректные данные при создании карточки.',
          ),
        );
      } else {
        next(err);
      }
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

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw next(new NotFoundErr('Карточка с id отсутствует в базе'));
      } else if (card.owner.toHexString() === req.user._id) {
        Card.deleteOne({ _id: cardId })
          .then((deletedCard) => res.send({ deletedCard, message: 'Карточка удалена' }))
          .catch(next);
      } else {
        throw next(new ForbiddenErr('Не достаточно прав для удаления карточки!'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestErr('Введены не корректные данные.'));
      } else {
        next(err);
      }
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
        throw next(new NotFoundErr('Карточка с указанным id не найдена.'));
      }

      res.send(card);
    })
    .catch(next);
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
        throw next(new NotFoundErr('Карточка с указанным id не найдена.'));
      }

      res.send(card);
    })
    .catch(next);
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
