const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

require('./src/db/mongoose');

const userRouter = require('./src/routers/user');
const flightRouter = require('./src/routers/flight');
const airportRouter = require('./src/routers/airport');
const discountRouter = require('./src/routers/discount');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname,'client/dist')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors());

app.use(userRouter);
app.use(flightRouter);
app.use(airportRouter);
app.use(discountRouter);

app.listen(port, () => {
   console.log(`server is up on port ${port}`);
});
