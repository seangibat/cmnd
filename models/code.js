var mongoose = require('mongoose');

var CodeSchema = new mongoose.Schema({
  value: { type: String, required: true },
  redirect_uri: { type: String, required: true },
  user_id: { type: String, required: true },
  client_id: { type: String, required: true }
});

module.exports = mongoose.model('Code', CodeSchema);