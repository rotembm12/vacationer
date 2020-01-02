const express = require('express');
const Flight = require('../models/flight');
const router = new express.Router();

router.post('/api/flights', async (req, res) => {
   try {
      const exsFlight = await Flight.findOne({
         apiId: req.body.apiId
      });
      if(exsFlight){
         exsFlight.wishlist++;
         await exsFlight.save();
         return res.send(exsFlight);
      }
      const flight = new Flight(req.body);
      await flight.save();
      res.send(flight);
   } catch (err) {
      res.send(err);
   }
});

router.get('/api/flights', async (req, res) => {
   const flightsIds = req.query.flights.split(',') || [];
   try {
      if(!(flightsIds.length > 0)){
         return res.send({err: 'no flights'});
      }

      const flights = await Flight.find({
         '_id':{ $in: flightsIds }
      }).populate('fromAirport')
        .populate('toAirport');
        
      res.send(flights);
   } catch (err) {
      res.send(err);
   }
});

router.delete('/api/flights/:id', async (req, res) => {
   try {
      const deletedFlight = await Flight.findOneAndDelete({
         _id: req.params.id
      });
      return deletedFlight ? res.send(deletedFlight) : res.status(404).send();
   } catch(err) {
      res.status(500).send(err);
   }
})

module.exports = router;
