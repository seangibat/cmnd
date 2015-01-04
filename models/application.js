var mongoose = require('mongoose');

var ApplicationSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String
  },
  command_word: {
    type: String,
    unique: true,
    required: true
  },
  user_id: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Application', ApplicationSchema);