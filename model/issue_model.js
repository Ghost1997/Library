const mongoose = require('mongoose');
var DateOnly = require('mongoose-dateonly')(mongoose);

const Schema = mongoose.Schema;

const issueSchema = new Schema({
  issueId: {
    type: String,
    required: true,
    unique:true
  },
  lib_no: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  bookId: {
    type: String,
    required: true
  },
  bookname: {
    type: String,
    required: true
  },
  issuedate: {
    type: DateOnly,
    required: true
  },
  duedate: {
    type: DateOnly,
    required: true
  }
});

module.exports = mongoose.model('Issue', issueSchema);








