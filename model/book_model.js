const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  bookId: {
    type: String,
    required: true,
    unique:true
  },
  author: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  qty: {
    type: Number,
    required: true
  },
  issue_days: {
    type: Number,
    required: true
  },
  cost: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Book', bookSchema);
