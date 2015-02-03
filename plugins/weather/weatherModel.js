var mongoose = require('mongoose');

var WeatherConfigSchema = new mongoose.Schema({
  zipcode: { type: String, required: true },
  user_id: { type: String, required: true }
});

module.exports = mongoose.model('WeatherConfig', WeatherConfigSchema);