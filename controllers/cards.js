const cards = require('../models/card');

const getCards = async (req, res)=>{
  try {
    const allCards = await cards.find({})
    res.send(allCards);
  } catch (err) {
    res.status(500).send({message: 'error'})
  }
}

const deleteCardById = async (req, res)=>{
  try {
    const cardWithId = await cards.findByIdAndDelete(req.params.id);
    res.send(cardWithId);
  } catch (err) {
    res.status(500).send({message: 'error'})
  }
}

const createCard = async (req, res)=> {
  const {name, link} = req.body;
  try {
    const card = await cards.create({name, link})
    res.send({data: card})
  } catch (err) {
    res.status(500).send({message: 'error'})
  }
}

module.exports = {getCards, deleteCardById, createCard};
