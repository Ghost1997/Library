const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studentSchema = new Schema({
  lib_no: {
    type: String,
    required: true,
    unique:true
  },
  roll_no: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  std: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Student', studentSchema);



