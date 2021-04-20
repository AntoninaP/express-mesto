const express = require('express');
const mongoose = require('mongoose');
const {routes} = require('./routes/index');
const {PORT = 3000} = process.env;

const app = express();

const helmet = require('helmet');
app.use(helmet());

app.use((req, res, next) => {
  req.user = {
    _id: '607d84bd972aae19b35a0e25'
  };

  next();
});

app.use(express.json());

app.use('/', routes);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
