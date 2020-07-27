const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const parkSchema = new Schema({
  lat: Number,
  lng: Number,
  name: String,
  style: {
    street: Boolean,
    vert: Boolean,
    pump: Boolean,
  },
  activityHours: String,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  rating: {
    one: Number,
    two: Number,
    three: Number,
    four: Number,
    five: Number,
  },
  about: String,
  default: Boolean,
});

const Park = mongoose.model('Park', parkSchema);

module.exports = Park;
