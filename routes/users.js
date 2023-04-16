const usersRouter = require('express').Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  editProfile,
  editAvatar,
} = require('../controllers/users');

usersRouter.get('/', getAllUsers);
usersRouter.get('/:userId', getUserById);
usersRouter.post('/', createUser);
usersRouter.patch('/me', editProfile);
usersRouter.patch('/me/avatar', editAvatar);

module.exports = usersRouter;
