'use strict';

const mongoose = require('mongoose');
const uri =
   'mongodb+srv://rbm1234:rbm1234@flightscluster-ftitu.mongodb.net/vacationer?retryWrites=true&w=majority';


   mongoose.connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
   }).then(() => console.log('mongoose conntected'))
     .catch(err => console.log(err.stack));


