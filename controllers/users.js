const User = require('../models/user');

const opt = { new: true, runValidators: true };

const getUsers = async (req, res) => {
  try {
    const allUsers = await User.find({})
      .orFail(new Error('NotValidId'));
    res.status(200).send(allUsers);
  } catch (err) {
    if (err.message === 'NotValidId') {
      res.status(404).send({ message: 'запрашиваемые пользователи не найдены' });
    } else {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    }
  }
};

const getUserById = async (req, res) => {
  try {
    const userWithId = await User.findById(req.params.id)
      .orFail(new Error('NotValidId'));
    res.status(200).send(userWithId);
  } catch (err) {
    if (err.message === 'NotValidId') {
      res.status(404).send({ message: 'запрашиваемый пользователь не найден' });
    } else {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    }
  }
};

const createUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  try {
    const user = await User.create({ name, about, avatar });
    res.send({ data: user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send(err.message);
    } else {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    }
  }
};

const updateProfile = async (req, res) => {
  try {
    const newUser = await User.findByIdAndUpdate(req.user._id, opt);
    if (newUser) {
      res.send(newUser);
    } else {
      res.status(404).send({ message: 'запрашиваемый пользователь не найден' });
    }
  } catch (err) {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const newAvatar = await User.findByIdAndUpdate(req.user._id, opt);
    if (newAvatar) {
      res.send(newAvatar);
    } else {
      res.status(404).send({ message: 'запрашиваемый пользователь не найден' });
    }
  } catch (err) {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports = {
  getUsers, getUserById, createUser, updateProfile, updateAvatar,
};
