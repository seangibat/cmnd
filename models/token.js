var mongoose = require('mongoose');

var TokenSchema = new mongoose.Schema({
  value: { type: String, required: true },
  user_id: { type: String, required: true },
  client_id: { type: String, required: true }
});

module.exports = mongoose.model('Token', TokenSchema);