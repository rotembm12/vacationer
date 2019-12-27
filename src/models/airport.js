const mongoose = require('mongoose');

const airportSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      trim: true
   },
   code: {
      type: String,
      required: true,
      trim: true
   },
   country: {
      type: String,
      required: true,
      trim: true
   },
   city: {
      type: String,
      required: true,
      trim: true
   },
   latitude: {
      type: Number,
      trim: true
   },
   longitude: {
      type: Number,
      trim: true
   }
});

const Airport = mongoose.model('Airport', airportSchema);
module.exports = Airport;
