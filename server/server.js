const express = require('express');
// const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const api = require('./routes/api');

const app = express();

const port = 3000

app.use(express.static(path.join(__dirname,"..", 'dist')));
app.use(express.static(path.join(__dirname,"..", 'node_modules')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use('strict')
app.use('/', api);

// mongoose.connect('mongodb://localhost/skateparkDB', { useNewUrlParser: true });


app.listen(port, function () {
    console.log(`Running on port ${port}`);
  });
  