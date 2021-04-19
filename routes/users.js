const express = require('express');
const userRoutes = express.Router();
const { getUsers, getUserById, createUser } = require('../controllers/users');


//вернуть всех пользователей
userRoutes.get('/', getUsers);

//вернуть пользователя по id
userRoutes.get('/:id', getUserById);

//создать пользователя
userRoutes.post('/', createUser);

exports.userRoutes = userRoutes;
