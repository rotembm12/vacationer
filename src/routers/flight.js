const express = require('express');
const fetch = require('node-fetch');
const Flight = require('../models/flight');
const Discount = require('../models/discount');
const router = new express.Router();

router.post('/api/flights/wishlist', async (req, res) => {
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
      flight.wishlist = 1;
      await flight.save();
      res.send(flight);
   } catch (err) {
      res.send(err);
   }
});

router.post('/api/flights/order', async (req, res) => {
   try {
      const exsFlight = await Flight.findOne({
         apiId: req.body.apiId
      });
      if(exsFlight){
         exsFlight.orders++;
         await exsFlight.save();
         return res.send(exsFlight);
      }
      const flight = new Flight(req.body);
      flight.orders = 1;
      await flight.save();
      res.send(flight);
   } catch (err) {
      res.send(err);
   }
})

router.post('/api/flights/outerapi', async (req, res) => {
   try {
      const response = await fetch(req.body.url);
      const flightsFromApi = await response.json();
      const flights = flightsFromApi.data.length > 50 ? flightsFromApi.data.slice(0,50) : flightsFromApi.data;
      const testedFlights = await Discount.discountsAvailable(flights);
      res.send(testedFlights);
   } catch (err){
      res.send(err);
   }
});

router.get('/api/flights', async (req, res) => {
   if(req.query.flights){
      try {
         const flightsIds = req.query.flights.split(',') || [];
         const flights = await Flight.find({
            'apiId':{ $in: flightsIds }
         }).populate('fromAirport')
           .populate('toAirport');
         console.log(flights);
         const testedFlights = await Discount.discountsAvailable(flights);
         console.log(testedFlights);
         res.send(testedFlights);
      }
      catch (err) {
         res.send(err);
      }
   } else {
      try {
         const flights = await Flight.find()
            .populate('fromAirport')
            .populate('toAirport');
         return res.send(flights);
      } catch(err) {
         res.send(err);
      }
   }
});

router.delete('/api/flights/wishlist/:id', async (req, res) => {
   try {
      const id = req.params.id || 'not-exist';
      if(id === 'not-exist'){
         return res.send({err: 'no id is given with the request'});
      }
      const existingFlight = await Flight.findById(id);
      if(existingFlight){
         const {wishlist, orders} = existingFlight;
         if(wishlist > 1 || orders > 0){
            existingFlight.wishlist = wishlist - 1;
            await existingFlight.save();
            return res.send(existingFlight);
         }
         const deletedFlight = await existingFlight.remove();
         res.send(deletedFlight);
      }
   } catch(err) {
      res.status(500).send(err);
   }
})

module.exports = router;
