const User = require('../models/users');
const {
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../utils/statusCodes');

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Сервер недоступен' });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error(
          'Пользователь по заданному id отсутствует в базе'
        );
        error.statusCode = NOT_FOUND;
        throw error;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST)
          .send({ message: 'Введены не корректные данные' });
      }
      if (err.statusCode === NOT_FOUND) {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Сервер недоступен' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => {
      res.status(CREATED).send(newUser, {
        message: 'Пользователь успешно создан',
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Сервер недоступен' });
    });
};

const editProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((newData) => {
      if (!req.user._id) {
        const error = new Error(
          'Пользователь по заданному id отсутствует в базе'
        );
        error.statusCode = NOT_FOUND;
        throw error;
      }
      res.send(newData);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
      }
      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({
          message: 'Пользователь по заданному id отсутствует в базе',
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Сервер недоступен' });
    });
};

const editAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((userData) => {
      if (!req.user._id) {
        const error = new Error(
          'Пользователь по заданному id отсутствует в базе'
        );
        error.statusCode = NOT_FOUND;
        throw error;
      }
      res.send(userData);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
      }
      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({
          message: 'Пользователь по заданному id отсутствует в базе',
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Сервер недоступен' });
    });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  editProfile,
  editAvatar,
};
