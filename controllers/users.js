const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/users');
const { secretKey, CREATED } = require('../utils/variables');
const {
  BadRequestErr,
  NotFoundErr,
  UnauthorizedErr,
  ConflictErr,
} = require('../errors');

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })

    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })

    .catch(next);
};

const getUserById = (req, res, next) => {
  console.log(req.params);
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundErr('Пользователь с указанным id не найден.'));
      }

      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestErr('Введены не корректные данные.'));
      }
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  if (!validator.isEmail(email)) {
    next(
      new BadRequestErr(
        'Переданы некорректные данные при создании пользователя'
      )
    );
  }
  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, about, avatar, email, password: hash })
      .then((newUser) => {
        res.status(CREATED).send(newUser);
      })
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictErr('Пользователь с такой почтой уже существует.'));
        }
        if (err.name === 'ValidationError') {
          next(
            new BadRequestErr(
              'Переданы некорректные данные при создании пользователя'
            )
          );
        }
      });
  });
};

const editProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((newData) => {
      if (!req.user._id) {
        next(new NotFoundErr('Пользователь с указанным id не найден.'));
      }

      res.send(newData);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestErr('Введены не корректные данные'));
      }
    });
};

const editAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((userData) => {
      if (!req.user._id) {
        next(new NotFoundErr('Пользователь с указанным id не найден.'));
      }

      res.send(userData);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestErr('Введены не корректные данные'));
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password') // команда добавляет в объект user хэш пароля
    .then((user) => {
      if (!user) {
        next(new UnauthorizedErr('Не правильная почта или пароль!'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          next(new UnauthorizedErr('Не правильная почта или пароль!'));
        }

        const token = jwt.sign({ _id: user._id }, secretKey, {
          expiresIn: '10d',
        });
        res
          .send({ token, message: 'Вход выполнен!' })
          .localStorage.setItem('token', token);
      });
    })
    .catch(next);
};

module.exports = {
  getAllUsers,
  getUserInfo,
  getUserById,
  createUser,
  editProfile,
  editAvatar,
  login,
};
