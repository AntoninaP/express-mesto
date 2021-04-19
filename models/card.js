const mongoose = require('mongoose');
//схема для карточки
const cardSchema = new mongoose.Schema({
  name: {},
  link: {},
  owner: {},
  likes: {},
  createdAt: {}
});

module.exports = mongoose.model('card', cardSchema);
