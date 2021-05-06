const mongoose = require('mongoose');
const { isURL } = require('validator');

// схема для карточки
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Минимальная длина 2 символа'],
    maxlength: [30, 'Максимальная длина 30 символов'],
  },

  link: {
    type: String,
    required: true,
    validate: [isURL, { require_protocol: true }, 'invalid URL'],
  },

  owner: {
    type: mongoose.ObjectId,
    required: true,
  },

  likes: {
    type: [mongoose.ObjectId],
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

cardSchema.path('link').validate((val) => {
  const urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
  return urlRegex.test(val);
}, 'Invalid URL.');

module.exports = mongoose.model('card', cardSchema);
