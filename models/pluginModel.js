var mongoose = require('mongoose');

var PluginSchema = new mongoose.Schema({
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
  },
  source: {
    type: String,
    required: true
  },
  config_html: {
    type: String,
    required: true
  },
  secrets: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Plugin', PluginSchema);