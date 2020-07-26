const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const parkSchema = new Schema({
    lat: Number,
    lng: Number,
    parkImg : String,
    name: String,
    style: [{
        street: Boolean,
        vert: Boolean,
        pump:Boolean 
      }],
    activityHours: String,
    createdBy: {type:Schema.Types.ObjectId, ref:'User'},
    rating: Number,
    about: String,
    defult: Boolean
});

const Park = mongoose.model('Park', parkSchema);

module.exports = Park;
