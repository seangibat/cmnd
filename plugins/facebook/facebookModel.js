var mongoose = require('mongoose');

var FacebookConfigSchema = new mongoose.Schema({
  token: { type: String, required: true },
  user_id: { type: String, required: true }
});

module.exports = mongoose.model('FacebookConfig', FacebookConfigSchema);