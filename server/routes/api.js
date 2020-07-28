const express = require('express');
const Park = require('../models/Park');
const User = require('../models/User');
const Comment = require('../models/Comment')
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
            one: Math.floor(Math.random() * 101),
            two: Math.floor(Math.random() * 101),
            three: Math.floor(Math.random() * 101),
            four: Math.floor(Math.random() * 101),
            five: Math.floor(Math.random() * 101),
          },
          about: 'Cool and Fun',
          activityHours: 'ALL day',
          style: {
            street: true,
            vert: true,
            pump: true,
          },
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

//create new park
router.post('/api/parks', function (req, res) {
  const parkData = req.body;
  parkData.lat = parseFloat(parkData.lat);
  parkData.lng = parseFloat(parkData.lng);
  const park = new Park(parkData);
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

//user login
router.post('/api/users/login', function (req, res) {
  const { email, password } = req.body;
  User.findOne({ email: email, password: password }).exec((err, user) =>
    res.send(user)
  );
});

//user register
router.post('/api/users/register', function (req, res) {
  const userData = req.body;
  const user = new User(userData);
  user.save().then((user) => res.send(user));
});

router.post('/api/parks/comments', function (req, res) {
  const commentDate = req.body;
  const comment = new Comment(commentDate);
  comment.save().then(comment => res.send(comment))
})

module.exports = router;
