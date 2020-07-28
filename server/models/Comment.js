const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: String,
  timeAdded: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  park :  { type: Schema.Types.ObjectId, ref: 'Park' }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
