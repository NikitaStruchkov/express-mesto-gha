const userRouter = require('express').Router();
const auth = require('../middlewares/auth');
const {
  validateUserById,
  validateUpdateUser,
  validateUpdateAvatar,
} = require('../middlewares/validate');

const {
  getUsers, getUsersById, updateUser, updateAvatar, currentUser
} = require('../controllers/user');

userRouter.get('/users', auth, getUsers); // возвращает всех пользователей

userRouter.get('/users/:userId',validateUserById, auth, getUsersById); // возвращает пользователя по _id

userRouter.get('/users/me', auth, currentUser); // возвращает информацию о текущем пользователе

userRouter.patch('/users/me',validateUpdateUser, auth, updateUser); // обновляет профиль

userRouter.patch('/users/me/avatar', validateUpdateAvatar, auth, updateAvatar); // обновляет аватар

module.exports = userRouter;
