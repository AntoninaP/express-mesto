const express = require('express');

const cardRoutes = express.Router();
const {
  getCards, deleteCardById, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

// вернуть все карточки
cardRoutes.get('/', getCards);

// удалить карточку по id
cardRoutes.delete('/:cardId', deleteCardById);

// создать карточку
cardRoutes.post('/', createCard);

// поставить лайк карточке
cardRoutes.put('/:cardId/likes', likeCard);

// убрать лайк с карточки
cardRoutes.delete('/:cardId/likes', dislikeCard);

exports.cardRoutes = cardRoutes;
