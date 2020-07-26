const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : String,
    password: String,
    email: String,
    picture: String,
    // parksCreated : [{type: Schema.Types.ObjectId, ref: 'Park'}]
    // comments: [{type:Schema.Types.ObjectId, ref:'Commit'}] 
})

const User = mongoose.model('User', userSchema);

module.exports = User;