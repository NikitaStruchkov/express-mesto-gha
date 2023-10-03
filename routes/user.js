const userRouter = require('express').Router();

const {
  getUsers, getUsersById, createUser, updateUser, updateAvatar,
} = require('../controllers/user');

userRouter.get('/users', getUsers); // возвращает всех пользователей

userRouter.get('/users/:userId', getUsersById); // возвращает пользователя по _id

userRouter.post('/users', createUser); // создаёт пользователя

userRouter.patch('/users/me', updateUser); // обновляет профиль

userRouter.patch('/users/me/avatar', updateAvatar); // обновляет аватар

module.exports = userRouter;
