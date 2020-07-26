const express = require("express");
// const moment = require("moment");
// const Park = require("./models/");
// const User = require("./models/")
const axios = require("axios");

const router = express.Router();

const getDataFromGoogle = () => {
  const API_KEY = "AIzaSyDayIjgDn311gKQQSC1ElzUeRw3Ww7Ixu4";
  const radius = 300000;
  const lat = 31.7683;
  const lng = 35.2137;
  const URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=skatebord&keyword=skate&key=${API_KEY}`;
  return axios.get(URL);
 
};

router.get("/api/skateparks", function(req, res) {
    getDataFromGoogle().then(data => {
    let filterd = data.data.results.filter(r => !r.permanently_closed).map(p => 
        ({lat :p.geometry.location.lat,
        lng : p.geometry.location.lng,
        name : p.name})
      );
      res.send(filterd);
  });
});




module.exports = router;
