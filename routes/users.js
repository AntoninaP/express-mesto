const express = require('express');
const userRoutes = express.Router();
const {getUsers, getUserById, createUser, updateProfile, updateAvatar} = require('../controllers/users');


//вернуть всех пользователей
userRoutes.get('/', getUsers);

//вернуть пользователя по id
userRoutes.get('/:id', getUserById);

//создать пользователя
userRoutes.post('/', createUser);

//обновить профиль
userRoutes.patch('/me', updateProfile);

//обновить аватар
userRoutes.patch('/me/avatar', updateAvatar);

exports.userRoutes = userRoutes;
