const users = require('../models/user');

const getUsers = async (req, res)=>{
  try {
    const allUsers = await users.find({})
      res.send(allUsers);
  } catch (err) {
    res.status(500).send({message: 'error'})
  }
}

const getUserById = async (req, res)=>{
  try {
    const userWithId = await users.findById(req.params.id);
    res.send(userWithId);
  } catch (err) {
    res.status(500).send({message: 'error'})
  }
}

const createUser = async (req, res)=> {
  const {name, about, avatar} = req.body;
  try {
    const user = await users.create({name, about, avatar})
    res.send({data: user})
  } catch (err) {
    res.status(500).send({message: 'error'})
  }
}

module.exports = {getUsers, getUserById, createUser};
