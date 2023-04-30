const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers,
  getUserById,
  editProfile,
  editAvatar,
  getUserInfo,
} = require('../controllers/users');

usersRouter.get('/', getAllUsers);
usersRouter.get('/me', getUserInfo);
usersRouter.get(
  '/:userId',
  celebrate({
    params: Joi.object({
      userId: Joi.string().required(),
    }),
  }),
  getUserById
);
usersRouter.patch(
  '/me',
  celebrate({
    body: Joi.object({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  editProfile
);
usersRouter.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object({
      avatar: Joi.string().regex(/^(http|https):\/\/[^ "]+$/),
    }),
  }),
  editAvatar
);

module.exports = usersRouter;
