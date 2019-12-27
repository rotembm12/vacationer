const express = require('express');
const Airport = require('../models/airport');

const router = new express.Router();

router.get('/api/airports', async (req, res) => {
   try {
      const airports = await Airport.find();
      res.send(airports);
   } catch (err) {
      res.send(err);
   }
});

router.post('/api/airports', async (req, res) => {
   try {
      if (req.body.airports) {
         const airports = JSON.parse(req.body.airports);
         const savedAirports = [];
         airports.forEach(async item => {
            const airport = new Airport(item);
            await airport.save();
            savedAirports.push(airport);
         });
         res.send(savedAirports);
      } else {
         const airport = new Airport(req.body);
         await airport.save();
         res.send(airport);
      }
   } catch (err) {
      res.send(err);
   }
});

module.exports = router;
