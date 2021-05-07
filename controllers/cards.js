const mongoose = require('mongoose');
const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

const getCards = async (req, res, next) => {
  try {
    const allCards = await Card.find({});
    res.status(200).send(allCards);
  } catch (err) {
    next(err);
  }
};

const deleteCardById = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId)
      .orFail(new NotFoundError('Объект не найден'));
    if (card.owner.toString() !== req.user._id) {
      throw new BadRequestError('Пользователь не имеет прав на удаление данной карточки');
    }

    const cardWithId = await Card.findByIdAndDelete(req.params.cardId)
      .orFail(new NotFoundError('Объект не найден'));
    res.status(200).send(cardWithId);
  } catch (err) {
    next(err);
  }
};

const createCard = async (req, res, next) => {
  const { name, link } = req.body;

  try {
    const card = new Card({ name, link, likes: [] });
    card.owner = new mongoose.Types.ObjectId(req.user._id);
    await card.save();
    res.send({ data: card });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return;
    }
    next(err);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const like = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
      .orFail(new NotFoundError('Объект не найден'));
    res.status(200).send(like);
  } catch (err) {
    next(err);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const dislike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
      .orFail(new NotFoundError('Объект не найден'));
    res.status(200).send(dislike);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCards, deleteCardById, createCard, likeCard, dislikeCard,
};
