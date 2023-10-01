const userRouter = require('express').Router();
// const User = require('../models/user');
const { getUsers, getUsersById, createUser } = require('../controllers/user');

userRouter.get('/users', getUsers); // возвращает всех пользователей

userRouter.get('/users/:userId', getUsersById); // возвращает пользователя по _id

userRouter.post('/users', createUser); // создаёт пользователя

module.exports = userRouter;
