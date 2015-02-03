var mongoose = require('mongoose');

// Define our beer schema
var CommandSchema   = new mongoose.Schema({
  plugin      : String,
  message     : String,
  user_id     : String,
  timestamp   : { type : Date, default: Date.now }
});

// Export the Mongoose model
module.exports = mongoose.model('Command', CommandSchema);