var mongoose = require('mongoose');

// Define our beer schema
var CommandSchema   = new mongoose.Schema({
  application: String,
  message: String,
  userId: String
});

// Export the Mongoose model
module.exports = mongoose.model('Command', CommandSchema);