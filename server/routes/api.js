const express = require('express');
// const moment = require("moment");
const Park = require('../models/Park');
const User = require('../models/User');
const comment = require('../models/Comment');
const axios = require('axios');

const router = express.Router();

const getDataFromGoogle = () => {
  const API_KEY = 'AIzaSyDayIjgDn311gKQQSC1ElzUeRw3Ww7Ixu4';
  const radius = 300000;
  const lat = 31.7683;
  const lng = 35.2137;
  const URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=skatebord&keyword=skate&key=${API_KEY}`;
  return axios.get(URL);
};

// ----- RUN ONLY ONCE ----- //
// get parks from google and store in db
router.get('/api/googleSkateparks', function (req, res) {
  getDataFromGoogle().then((data) => {
    const filtered = data.data.results
      .filter((r) => !r.permanently_closed)
      .map((p) => {
        const park = new Park({
          lat: p.geometry.location.lat,
          lng: p.geometry.location.lng,
          name: p.name,
          default: true,
          rating: {
            one: 2,
            two: 4,
            three: 4,
            four: 24,
            five: 31,
          },
          about: 'Cool and Fun',
        });
        park.save();
      });
    res.end();
  });
});

//get all parks from db
router.get('/api/skateparks', function (req, res) {
  Park.find({}).exec((err, data) => res.send(data));
});

router.post('/api/parks', function (req, res) {
  let park = req.body;
  park = new Park(park);
  park.save().then((park) => res.send(park));
});

//update park rating
router.put('/api/parks/:rate/:parkId', function (req, res) {
  const { rate, parkId } = req.params;
  Park.findOne({ _id: parkId }, (err, park) => {
    park.rating[rate]++;
    park.save().then((park) => res.send(park));
  });
});

router.post('/api/users/login', function (req, res) {
  let { email } = req.body;
  let { password } = req.body;
  User.findOne({ email: email, password: password }).exec(function (err, user) {
    res.send(user);
  });
});

router.post('/api/users/register', function (req, res) {
  let user = req.body;
  user = new User(user);
  user.save().then((user) => res.send(user));
});

module.exports = router;
