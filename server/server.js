const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const api = require('./routes/api');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use(express.static(path.join(__dirname, '..', 'node_modules')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', api);

mongoose
  .connect(`${process.env.MONGO_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((connect) => console.log('connected to mongodb'))
  .catch((e) => console.log('could not connect to mongodb', e));

app.listen(port, function () {
  console.log(`Running on port ${port}`);
});
