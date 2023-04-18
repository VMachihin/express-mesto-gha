const Card = require('../models/cards');
const {
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../utils/statusCodes');

const createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: _id })
    .then((newCard) => {
      res.status(CREATED).send(newCard, {
        message: 'Карточка успешно добавлена',
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Сервер недоступен' });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Сервер недоступен' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        const error = new Error('Карточка с id отсутствует в базе');
        error.statusCode = NOT_FOUND;
        throw error;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Карточка с указанным _id не найдена.',
        });
      }
      if (err.statusCode === NOT_FOUND) {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Карточка с указанным id не найдена.' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Сервер недоступен' });
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        const error = new Error('Карточка с id отсутствует в базе');
        error.statusCode = NOT_FOUND;
        throw error;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные для постановки лайка.',
        });
      }
      if (err.statusCode === NOT_FOUND) {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Карточка с указанным id не найдена.' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Сервер недоступен' });
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        const error = new Error('Карточка с id отсутствует в базе');
        error.statusCode = NOT_FOUND;
        throw error;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные для снятия лайка.',
        });
      }
      if (err.statusCode === NOT_FOUND) {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Карточка с указанным id не найдена.' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Сервер недоступен' });
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
