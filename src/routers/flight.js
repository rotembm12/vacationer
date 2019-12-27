const express = require('express');
const Flight = require('../models/flight');
const router = new express.Router();

router.post('/api/flights', async (req, res) => {
   try {
      const flight = new Flight(req.body);
      await flight.save();
      res.send(flight);
   } catch (err) {
      res.send(err);
   }
});
router.get('/api/flights', async (req, res) => {
   try {
      const flights = await Flight.find();
      res.send(flights);
   } catch (err) {
      res.send(err);
   }
});

module.exports = router;
