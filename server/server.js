const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const api = require('./routes/api');

const app = express();

const port = //PORT NUM

app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', api);

mongoose.connect('mongodb://localhost/*****db-name*****', { useNewUrlParser: true });



app.listen(port, function () {
    console.log(`Running on port ${port}`);
  });
  