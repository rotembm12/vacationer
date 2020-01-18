const express = require('express');
const User = require('../models/user');

const router = new express.Router();

router.post('/api/users', async (req, res) => {
   //creating new user 
   try {
      const user = new User(req.body);
      await user.save();
      res.status(201).send(user);
   } catch (err) {
      throw(err);
   }
});

router.get('/api/users', async (req, res) => {
   //read all existing users 
   try {
      const users = await User.find();
      res.send(users);
   } catch (err) {
      res.send(err);
   }
});

router.post('/api/users/login', async (req, res) => {
   const {username, password, email} = req.body;   
   console.log(req.body);
   try {
      ;
      const user = await User.findOne({name: username, password});
      console.log(user);
      if(!user){
         return res.send({msg: "no such user"});
      }
      res.send(user);
   } catch (err) {
      res.send(err);
   }
})

module.exports = router;
