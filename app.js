const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const {routes} = require('./routes/index');
const {login, createUser} = require('./controllers/users');
const {celebrate, Joi} = require('celebrate');
const {errors} = require('celebrate');


const {PORT = 3000} = process.env;
const app = express();
const auth = require('./middlewares/auth');

app.use(helmet());

app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use(auth);

app.use('/', routes);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

//обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

//централизованный обработчик
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const {statusCode = 500, message} = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
