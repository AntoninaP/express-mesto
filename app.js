const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { routes } = require('./routes/index');
const { login, createUser } = require('./controllers/users')

const { PORT = 3000 } = process.env;
const app = express();
const auth = require('./middlewares/auth');

app.use(helmet());

// app.use((req, res, next) => {
//   req.user = {
//     _id: '60833bc7ae0ee452db4342e9',
//   };
//
//   next();
// });

app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/', routes);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
