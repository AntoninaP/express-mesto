const express = require('express');

const userRoutes = express.Router();
const {
  getUsers, getUserById, getCurrentUser, createUser, updateProfile, updateAvatar,
} = require('../controllers/users');

// вернуть всех пользователей
userRoutes.get('/', getUsers);

//вернуть информацию о текущем пользователе
userRoutes.get('/me', getCurrentUser);

// обновить профиль
userRoutes.patch('/me', updateProfile);

// обновить аватар
userRoutes.patch('/me/avatar', updateAvatar);

// вернуть пользователя по id
userRoutes.get('/:id', getUserById);

// создать пользователя
// userRoutes.post('/', createUser);


exports.userRoutes = userRoutes;
