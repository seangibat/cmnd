var mongoose = require('mongoose');

var ApplicationSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String
  },
  command: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Application', ApplicationSchema);