const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { routes } = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());

app.use((req, res, next) => {
  req.user = {
    _id: '60833bc7ae0ee452db4342e9',
  };

  next();
});

app.use(express.json());

app.use('/', routes);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
