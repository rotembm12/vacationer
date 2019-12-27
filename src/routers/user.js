const express = require('express');
const User = require('../models/user');

const router = new express.Router();

router.post('/api/users', async (req, res) => {
   //creating new user route
   try {
      const user = new User(req.body);
      await user.save();
      res.status(201).send(user);
   } catch (err) {
      res.send(err);
   }
});

router.get('/api/users', async (req, res) => {
   //read all existing users route
   try {
      const users = await User.find();
      res.send(users);
   } catch (err) {
      res.send(err);
   }
});

module.exports = router;
