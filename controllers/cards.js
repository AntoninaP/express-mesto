const Card = require('../models/card');
const mongoose = require('mongoose');

const getCards = async (req, res) => {
  try {
    const allCards = await Card.find({})
    if (allCards) {
      res.send(allCards);
    } else {
      res.status(404).send({message: 'запрашиваемые карточки не найдены'})
    }
  } catch (err) {
    res.status(500).send({message: 'На сервере произошла ошибка'})
  }
}

const deleteCardById = async (req, res) => {
  try {
    const cardWithId = await Card.findByIdAndDelete(req.params.id)
      .orFail(new Error('NotValidId'))
    {
      res.status(200).send(cardWithId);
    }
  } catch (err) {
    if (err.message === 'NotValidId') {
      res.status(404).send({message: 'запрашиваемая карточка не найдена'})
    } else {
      res.status(500).send({message: 'На сервере произошла ошибка'})
    }
  }
}

const createCard = async (req, res) => {
  const {name, link} = req.body;
  try {
    const card = new Card({name, link, likes: []})
    card.owner = new mongoose.Types.ObjectId(req.user._id)
    await card.save();
    res.send({data: card})
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send(err.message)
    } else {
      res.status(500).send({message: 'На сервере произошла ошибка'})
    }
  }
}

const likeCard = async (req, res) => {
  try {
    const like = await Card.findByIdAndUpdate(
      req.params.cardId,
      {$addToSet: {likes: req.user._id}}, // добавить _id в массив, если его там нет
      {new: true},
    )
      .orFail(new Error('NotValidId'))
    {
      res.status(200).send(like);
    }
  } catch (err) {
    if (err.message === 'NotValidId') {
      res.status(404).send({message: 'запрашиваемая карточка не найдена'})
    } else {
      res.status(500).send({message: 'На сервере произошла ошибка'})
    }
  }
}

const dislikeCard = async (req, res) => {
  try {
    const dislike = await Card.findByIdAndUpdate(
      req.params.cardId,
      {$pull: {likes: req.user._id}}, // убрать _id из массива
      {new: true},
    )
      .orFail(new Error('NotValidId'))
    {
      res.status(200).send(dislike);
    }
  } catch (err) {
    if (err.message === 'NotValidId') {
      res.status(404).send({message: 'запрашиваемая карточка не найдена'})
    } else {
      res.status(500).send({message: 'На сервере произошла ошибка'})
    }
  }
}

module.exports = {getCards, deleteCardById, createCard, likeCard, dislikeCard};
