const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const AuthError = require('../errors/auth-error');
const EmailIsExistError = require('../errors/email-is-exist-error');

const opt = { new: true, runValidators: true };

const getUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find({});
    res.status(200).send(allUsers);
  } catch (err) {
    next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const currentUser = await User.find({ _id: req.user._id })
      .orFail(new NotFoundError('Объект не найден'));
    res.status(200).send(currentUser);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const userWithId = await User.findById(req.params.id)
      .orFail(new NotFoundError('Объект не найден'));
    res.status(200).send(userWithId);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  try {
    // хешируем пароль
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hash,
    });
    res.send({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return;
    }
    if (err.name === 'MongoError' && err.code === 11000) {
      next(new EmailIsExistError('Данный email уже зарегистрирован'));
      return;
    }
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  const { name, about } = req.body;
  try {
    const newUser = await User.findByIdAndUpdate(req.user._id, { name, about }, opt)
      .orFail(new NotFoundError('Объект не найден'));
    res.status(200).send(newUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return;
    }
    next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;

  try {
    const newAvatar = await User.findByIdAndUpdate(req.user._id, { avatar }, opt)
      .orFail(new NotFoundError('Объект не найден'));
    res.status(200).send(newAvatar);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return;
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AuthError('Неправильные почта или пароль');
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      // хеши не совпали — отклоняем промис
      throw new AuthError('Неправильные почта или пароль');
    }
    // совпали - аутентификация успешна
    // создадим токен
    const token = jwt.sign({ _id: user._id },
      'some-secret-key',
      { expiresIn: '7d' });
    // вернём токен
    res.send({ token });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers, getUserById, getCurrentUser, createUser, updateProfile, updateAvatar, login,
};
