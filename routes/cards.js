const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');

const cardRoutes = express.Router();
const {
  getCards, deleteCardById, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

// вернуть все карточки
cardRoutes.get('/', getCards);

// удалить карточку по id
cardRoutes.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }).unknown(true),
}), deleteCardById);

// создать карточку
const checkURL = (val, helper) => {
  if (!isURL(val, { require_protocol: true })) {
    return helper.message('Не валидный URL');
  }

  return val;
};
cardRoutes.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().custom(checkURL, 'invalid URL').required(),
    createdAt: Joi.date(),
  }),
}), createCard);

// поставить лайк карточке
cardRoutes.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }).unknown(true),
}), likeCard);

// убрать лайк с карточки
cardRoutes.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }).unknown(true),
}), dislikeCard);

exports.cardRoutes = cardRoutes;
