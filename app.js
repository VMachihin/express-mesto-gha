const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { routeNotFound, centralizedErrorHandler } = require('./utils/centralized-error-handler');

const router = require('./routes');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use(router);

app.use(errors());

app.use(routeNotFound);

app.use(centralizedErrorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
