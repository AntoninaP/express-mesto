const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');

const userRoutes = express.Router();
const {
  getUsers, getUserById, getCurrentUser, updateProfile, updateAvatar,
} = require('../controllers/users');

// вернуть всех пользователей
userRoutes.get('/', getUsers);

// вернуть информацию о текущем пользователе
userRoutes.get('/me', getCurrentUser);

// обновить профиль
userRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateProfile);

// обновить аватар
const checkURL = (val, helper) => {
  if (!isURL(val, { require_protocol: true })) {
    return helper.message('Не валидный URL');
  }

  return val;
};

userRoutes.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(checkURL, 'invalid URL'),
  }),
}), updateAvatar);

// вернуть пользователя по id
userRoutes.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }).unknown(true),
}), getUserById);

exports.userRoutes = userRoutes;
