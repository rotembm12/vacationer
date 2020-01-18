const mongoose = require('mongoose');

const discountSchmea = new mongoose.Schema({
    minWishlists: {
        type: Number,
        default: 0
    },
    minOrders: {
        type: Number,
        default: 0
    },
    airline: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    }
});

discountSchmea.statics.discountsAvailable = async (flights) => {
    const discounts = await Discount.find();
    const testedFlights = flights.map(flight => {
        discounts.forEach(disc => {
            const {
                discount,
                minWishlists, 
                minOrders, 
                airline
            } = disc;
            if(flight.airlines){
                if (
                    flight.wishlist >= minWishlists &&
                    flight.orders >= minOrders &&
                    flight.airlines[0] === airline || flight.airlines[1] === airline
                ){
                    flight.discount = discount;
                }
            } else {
                if (
                    flight.wishlist >= minWishlists &&
                    flight.orders >= minOrders &&
                    flight.airline === airline
                ){
                    flight.discount = discount;
                }
            }
            
        });
        return flight;
    });
    return testedFlights;
}

const Discount = mongoose.model('Discount', discountSchmea);
module.exports = Discount;