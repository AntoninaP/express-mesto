const express = require('express');
const cardRoutes = express.Router();
const { getCards, deleteCardById, createCard } = require('../controllers/cards');


//вернуть все карточки
cardRoutes.get('/', getCards);

//удалить карточку по id
cardRoutes.delete('/:cardId', deleteCardById);

//создать карточку
cardRoutes.post('/', createCard);

exports.cardRoutes = cardRoutes;
