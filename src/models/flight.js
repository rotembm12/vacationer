const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
   departure: {
      type: Date,
      required: true
   },
   arrival: {
      type: Date,
      required: true
   },
   origin: {
      type: String,
      required: true
   },
   destination: {
      type: String,
      required: true
   },
   arrival: {
      type: Date,
      required: true
   },
   price: {
      type: Number,
      required: true
   },
   fromAirport: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: 'Airport'
   },
   toAirport: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: 'Airport'
   },
   meta: {
      wishList: Number,
      purchases: Number
   }
});

const Flight = mongoose.model('Flight', flightSchema);
module.exports = Flight;
