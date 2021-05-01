const express = require('express');
const {celebrate, Joi} = require('celebrate');
const userRoutes = express.Router();
const {
  getUsers, getUserById, getCurrentUser, updateProfile, updateAvatar,
} = require('../controllers/users');

// вернуть всех пользователей
userRoutes.get('/', getUsers);

//вернуть информацию о текущем пользователе
userRoutes.get('/me', getCurrentUser)

// обновить профиль
userRoutes.patch('/me', updateProfile);

// обновить аватар
userRoutes.patch('/me/avatar', updateAvatar);

// вернуть пользователя по id
userRoutes.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }).unknown(true),
}), getUserById);

exports.userRoutes = userRoutes;
