const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers,
  getUserById,
  editProfile,
  editAvatar,
  getUserInfo,
} = require('../controllers/users');
const { urlValidate } = require('../utils/variables');

usersRouter.get('/', getAllUsers);
usersRouter.get('/me', getUserInfo);
usersRouter.get(
  '/:userId',
  celebrate({
    params: Joi.object({
      userId: Joi.string().hex().required(),
    }),
  }),
  getUserById,
);
usersRouter.patch(
  '/me',
  celebrate({
    body: Joi.object({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }),
  editProfile,
);
usersRouter.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object({
      avatar: Joi.string().regex(urlValidate).required(),
    }),
  }),
  editAvatar,
);

module.exports = usersRouter;
